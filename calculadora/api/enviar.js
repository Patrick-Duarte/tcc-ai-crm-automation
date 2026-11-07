// Red Geek 3D · ponte entre a calculadora e o n8n
// O navegador nunca vê a URL do webhook nem o segredo: ambos ficam nas
// variáveis de ambiente da Vercel (N8N_WEBHOOK_URL e N8N_SECRET).
//
// POST /api/enviar            → recalcula e envia ao n8n (cria o negócio); devolve a ficha em PDF ao app
// POST /api/enviar?preview=1  → só recalcula e devolve a ficha em PDF (não fala com o n8n)
// A ficha em PDF fica só no app: não é enviada ao n8n nem anexada ao Ploomes.

import jspdfPkg from 'jspdf';
import { gerarFichaPedido, numeroPedido } from './_pedido-pdf.js';

const { jsPDF } = jspdfPkg;

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const r2 = (v) => Math.round(v * 100) / 100;

// Mesmo cálculo da calculadora, refeito no servidor.
// Assim um valor editado no navegador não chega ao Ploomes.
function recalcular(p) {
  const S = {};
  for (const k of ['peso','th','tm','qtd','pkg','desp','pimp','vida','watt','kwh','manut','fixo','hmes','falha','mmin','mval','emb','mfixa','tpct','tfix']) {
    S[k] = num(p?.[k]);
  }
  const mmode = p?.mmode === 'fixa' ? 'fixa' : 'auto';
  const faixas = Array.isArray(p?.faixas) && p.faixas.length
    ? p.faixas.map((f) => [f?.[0] === null ? null : num(f?.[0]), num(f?.[1])])
    : [[10,150],[25,120],[50,100],[100,80],[200,60],[null,45]];

  const h = S.th + Math.min(S.tm, 59) / 60;
  const q = Math.max(1, Math.round(S.qtd));
  const hDep = S.vida > 0 ? S.pimp / S.vida : 0;
  const hEn = (S.watt / 1000) * S.kwh;
  const hFix = S.hmes > 0 ? S.fixo / S.hmes : 0;
  const hm = hDep + S.manut + hEn + hFix;
  const fil = (S.peso * (1 + S.desp / 100) / 1000) * S.pkg;
  const maq = hm * h;
  const falha = (fil + maq) * S.falha / 100;
  const mao = (S.mmin / 60) * S.mval;
  const ext = S.emb;
  const custo = fil + maq + falha + mao + ext;

  let m = S.mfixa, fi = -1;
  if (mmode === 'auto') {
    fi = faixas.findIndex((f) => f[0] === null || custo <= f[0]);
    if (fi === -1) fi = faixas.length - 1;
    m = faixas[fi][1];
  }
  const t = Math.min(S.tpct, 90) / 100;
  const bruto = (custo * (1 + m / 100) + S.tfix) / (1 - t);
  let preco = bruto;
  if (p?.arred && preco > 0) {
    preco = Math.floor(preco) + 0.9;
    if (preco < bruto - 1e-9) preco += 1;
  }
  const taxas = preco * t + S.tfix;
  const lucro = preco - taxas - custo;

  return {
    q, h, hm, hDep, hEn, hFix, manut: S.manut, fil, maq, falha, mao, ext, custo, m, fi, mmode, preco, taxas, lucro,
    peso: S.peso, pkg: S.pkg, desp: S.desp, falhaPct: S.falha, mmin: S.mmin, mval: S.mval, tpct: S.tpct, tfix: S.tfix,
    filTotalG: S.peso * (1 + S.desp / 100) * q,
  };
}

// Resumo numérico que vai para o n8n / checklist do negócio
function resumo(C) {
  return {
    quantidade: C.q,
    precoUnitario: r2(C.preco),
    total: r2(C.preco * C.q),
    custoUnitario: r2(C.custo),
    custoTotal: r2(C.custo * C.q),
    taxasUnitario: r2(C.taxas),
    lucroUnitario: r2(C.lucro),
    lucroTotal: r2(C.lucro * C.q),
    margemPct: C.m,
    horas: r2(C.h),
    horasTotal: r2(C.h * C.q),
    pesoG: C.peso,
    filamentoTotalG: Math.round(C.filTotalG),
    composicao: {
      filamento: r2(C.fil), maquina: r2(C.maq), falhas: r2(C.falha), trabalho: r2(C.mao), extras: r2(C.ext),
      horaMaquina: r2(C.hm), taxaCanalPct: C.tpct, tarifaFixa: r2(C.tfix),
    },
  };
}

const texto = (v, max = 300) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido' });
  }
  const preview = req.query?.preview === '1';

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  const c = body.cliente || {};
  const p = body.pedido || {};

  const cliente = {
    tipo: c.tipo === 'Empresa' ? 'Empresa' : 'Pessoa Física',
    nome: texto(c.nome, 120),
    cnpj: String(c.cnpj || '').replace(/\D/g, '').slice(0, 14),
    responsavel: texto(c.responsavel, 120),
    email: texto(c.email, 120).toLowerCase(),
    whatsapp: String(c.whatsapp || '').replace(/\D/g, '').slice(0, 15),
  };
  const pedido = {
    canal: texto(p.canal, 40),
    produto: texto(p.produto, 120),
    prazo: /^\d{4}-\d{2}-\d{2}$/.test(p.prazo || '') ? p.prazo : null,
    link: texto(p.link, 300),
    obs: texto(p.obs, 300),
  };

  if (!cliente.nome || !pedido.produto) return res.status(400).json({ erro: 'Nome do cliente e produto são obrigatórios.' });
  if (cliente.tipo === 'Empresa' && (cliente.cnpj.length !== 14 || !cliente.responsavel)) {
    return res.status(400).json({ erro: 'Empresa precisa de CNPJ válido e contato responsável.' });
  }
  if (!cliente.email && !cliente.whatsapp) return res.status(400).json({ erro: 'Informe e-mail ou WhatsApp.' });

  const C = recalcular(body.parametros);
  if (!(C.preco > 0)) return res.status(400).json({ erro: 'Orçamento inválido.' });

  const numero = numeroPedido();
  const arquivo = `Pedido-${numero}.pdf`;
  let pdfBase64;
  try {
    const doc = gerarFichaPedido(jsPDF, { numero, cliente, pedido, C });
    pdfBase64 = Buffer.from(doc.output('arraybuffer')).toString('base64');
  } catch (e) {
    console.error('PDF', e);
    return res.status(500).json({ erro: 'Falha ao gerar a ficha do pedido.' });
  }

  if (preview) return res.status(200).json({ ok: true, numero, arquivo, pdfBase64 });

  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_SECRET;
  if (!url || !secret) {
    return res.status(503).json({ erro: 'Integração ainda não configurada no servidor.', numero, arquivo, pdfBase64 });
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-secret': secret },
      body: JSON.stringify({
        numero, cliente, pedido, orcamento: resumo(C),
        enviadoEm: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(25000),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) return res.status(502).json({ erro: data.erro || `n8n respondeu ${resp.status}` });
    return res.status(200).json({
      ok: true, numero, dealId: data.dealId ?? null,
      total: r2(C.preco * C.q), arquivo, pdfBase64,
    });
  } catch {
    return res.status(502).json({ erro: 'Falha ao falar com o n8n.' });
  }
}

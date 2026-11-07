// Red Geek 3D · Ficha interna de abertura de pedido (gerada pelo app; não vai para o n8n nem para o Ploomes)
// Arquivos em /api que começam com "_" não viram endpoint na Vercel.

const TZ = 'America/Sao_Paulo';
const brl = (v) => (Number.isFinite(v) ? v : 0)
  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  .replace(/[  ]/g, ' ');
const pct = (v) => (Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const n1 = (v) => (Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const hhmm = (h) => `${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const dataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

export function numeroPedido(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return `RG-${p.year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}`;
}

// C = composição (recalculada no servidor), cli = cliente, ped = pedido
export function gerarFichaPedido(jsPDF, { numero, cliente: cli, pedido: ped, C }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const L = 16, R = 194, W = R - L;
  const RED = [226, 0, 17], INK = [17, 18, 20], MUTED = [95, 99, 107], LINE = [227, 228, 231], SOFT = [246, 246, 247], OK = [31, 122, 69];
  let y = 0;

  const novaPagina = () => { doc.addPage(); y = 18; };
  const garantir = (h) => { if (y + h > 283) novaPagina(); };

  // Cabeçalho
  doc.setFillColor(...RED); doc.rect(0, 0, 210, 6, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(21); doc.setTextColor(...INK);
  doc.text('ABERTURA DE PEDIDO', L, 22);
  doc.setFontSize(8.5); doc.setTextColor(...RED); doc.text('USO INTERNO · NÃO ENVIAR AO CLIENTE', L, 28);
  doc.setFontSize(11); doc.setTextColor(...INK); doc.text('RED GEEK 3D STUDIO', R, 17, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text('Nº ' + numero, R, 23, { align: 'right' });
  doc.text('Aberto em ' + new Date().toLocaleString('pt-BR', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' }), R, 28, { align: 'right' });
  doc.setDrawColor(...RED); doc.setLineWidth(0.7); doc.line(L, 32, R, 32);
  y = 38;

  const secao = (titulo) => {
    garantir(16);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...INK);
    doc.text(titulo.toUpperCase(), L, y);
    doc.setDrawColor(...INK); doc.setLineWidth(0.4); doc.line(L, y + 1.8, R, y + 1.8);
    y += 6.5;
  };

  // linhas "rótulo: valor" em duas colunas
  const campos = (lista) => {
    const col = W / 2;
    lista = lista.filter(([, v]) => v !== undefined && v !== null && v !== '');
    for (let i = 0; i < lista.length; i += 2) {
      let alt = 0;
      for (let j = 0; j < 2 && i + j < lista.length; j++) {
        const [k, v] = lista[i + j];
        const x = L + j * col;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
        doc.text(k.toUpperCase(), x, y);
        doc.setFontSize(10); doc.setTextColor(...INK);
        const linhas = doc.splitTextToSize(String(v), col - 4);
        doc.text(linhas, x, y + 4.5);
        alt = Math.max(alt, 4.5 + linhas.length * 4.4);
      }
      y += alt + 1.6;
      garantir(10);
    }
    y += 1;
  };

  // linha da tabela de composição: descrição + detalhe à esquerda, valor à direita
  const linha = (desc, det, val, estilo) => {
    const h = det ? 8.8 : 6.6;
    garantir(h + 2);
    if (estilo === 'soma' || estilo === 'destaque') { doc.setFillColor(...SOFT); doc.rect(L, y - 4.8, W, h, 'F'); }
    const cor = estilo === 'lucro' ? OK : estilo === 'destaque' ? RED : INK;
    doc.setFont('helvetica', estilo ? 'bold' : 'normal'); doc.setFontSize(10); doc.setTextColor(...cor);
    doc.text(desc, L + 2, y);
    doc.text(val, R - 2, y, { align: 'right' });
    if (det) { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...MUTED); doc.text(det, L + 2, y + 3.6); }
    y += h - 4.8;
    doc.setDrawColor(...LINE); doc.setLineWidth(0.25); doc.line(L, y, R, y);
    y += 4.8;
  };

  const isEmp = cli.tipo === 'Empresa';
  secao('Cliente');
  campos([
    ['Tipo', cli.tipo],
    [isEmp ? 'Empresa' : 'Nome', cli.nome],
    isEmp ? ['CNPJ', cli.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')] : ['', ''],
    isEmp ? ['Contato responsável', cli.responsavel] : ['', ''],
    ['E-mail', cli.email || '—'],
    ['WhatsApp', cli.whatsapp || '—'],
  ]);

  secao('Pedido');
  campos([
    ['Produto', ped.produto],
    ['Quantidade', `${C.q} un.`],
    ['Canal de venda', ped.canal || '—'],
    ['Prazo desejado', dataBR(ped.prazo) || 'A combinar'],
    ['Link do arquivo', ped.link],
    ['Personalização / observações', ped.obs],
  ]);

  secao('Produção (por unidade · total do pedido)');
  campos([
    ['Peso da peça', `${n1(C.peso)} g · ${n1(C.filTotalG / 1000)} kg com desperdício`],
    ['Tempo de impressão', `${hhmm(C.h)} · ${hhmm(C.h * C.q)} no total`],
    ['Filamento', `${brl(C.pkg)}/kg · ${pct(C.desp)} de desperdício`],
    ['Hora-máquina', `${brl(C.hm)}/h`],
  ]);
  y += 2;

  secao('Composição do preço (por unidade)');
  linha('Filamento', `${n1(C.peso)} g + ${pct(C.desp)} de desperdício`, brl(C.fil));
  linha('Máquina', `${hhmm(C.h)} × ${brl(C.hm)}/h (depreciação ${brl(C.hDep)} + manutenção ${brl(C.manut)} + energia ${brl(C.hEn)} + custo fixo ${brl(C.hFix)})`, brl(C.maq));
  linha('Reserva para falhas', `${pct(C.falhaPct)} sobre filamento + máquina`, brl(C.falha));
  linha('Seu trabalho', `${n1(C.mmin)} min a ${brl(C.mval)}/h`, brl(C.mao));
  linha('Embalagem e extras', '', brl(C.ext));
  linha('Custo da peça', '', brl(C.custo), 'soma');
  linha('Margem', C.mmode === 'auto' ? `faixa ${C.fi + 1} (automática)` : 'definida manualmente', pct(C.m));
  linha('Taxas do canal', pct(C.tpct) + (C.tfix ? ' + ' + brl(C.tfix) : ''), brl(C.taxas));
  linha('Preço de venda por unidade', '', brl(C.preco), 'destaque');
  linha('Lucro por unidade', C.preco > 0 ? `${pct((C.lucro / C.preco) * 100)} do preço` : '', brl(C.lucro), 'lucro');
  y += 3;

  secao(`Totais do pedido (${C.q} un.)`);
  garantir(16);
  const tot = [['Valor total da venda', brl(C.preco * C.q), RED], ['Custo de produção', brl(C.custo * C.q), INK],
    ['Taxas do canal', brl(C.taxas * C.q), INK], ['Lucro total', brl(C.lucro * C.q), OK]];
  const cw = W / 4;
  doc.setFillColor(...SOFT); doc.rect(L, y - 3, W, 14, 'F');
  tot.forEach(([k, v, cor], i) => {
    const x = L + i * cw + 3;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...MUTED); doc.text(k.toUpperCase(), x, y + 1);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...cor); doc.text(v, x, y + 7.5);
  });
  y += 16;

  secao('Checklist de produção');
  const itens = ['Arquivo fatiado', 'Filamento separado', 'Impressão concluída', 'Pós-processo',
    'Conferência de qualidade', 'Embalagem', 'Cliente avisado', 'Entregue / enviado'];
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...INK);
  itens.forEach((t, i) => {
    const x = L + (i % 4) * (W / 4), yy = y + Math.floor(i / 4) * 6;
    doc.setDrawColor(...MUTED); doc.setLineWidth(0.3); doc.rect(x, yy - 3, 3.4, 3.4);
    doc.text(t, x + 5, yy);
  });
  y += Math.ceil(itens.length / 4) * 6 + 2;
  garantir(1);
  doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text('Impressora: ____________________', L, y);
  doc.text('Início: ____/____', L + 78, y);
  doc.text('Término: ____/____', L + 128, y);

  const pags = doc.getNumberOfPages();
  for (let p = 1; p <= pags; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE); doc.setLineWidth(0.25); doc.line(L, 286, R, 286);
    doc.setFontSize(7.5); doc.setTextColor(150, 150, 150);
    doc.text(`Red Geek 3D Studio - ficha interna ${numero}`, L, 290);
    doc.text(`${p}/${pags}`, R, 290, { align: 'right' });
  }
  return doc;
}

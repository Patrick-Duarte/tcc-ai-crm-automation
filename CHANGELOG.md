# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.0.0] — 2026-11-07

Primeira publicação do projeto.

### Calculadora (Vercel)
- Cálculo de preço em tempo real: filamento, hora-máquina, falhas, mão de obra, embalagem, taxas e margem por faixa.
- PDF do cliente com compartilhamento no WhatsApp.
- Ficha interna "Abertura de pedido" gerada no servidor, com recálculo de valores.

### Workflow 1 — Cadastro de pedidos por PDF
- Upload da ficha, extração com Gemini e validação estruturada.
- Busca e criação de opção de produto.
- Criação de empresa, responsável e negócio com 12 campos personalizados.

### Workflow 2 — Análise de viabilidade
- Parecer de IA em 10 seções, gravado no campo "Análise IA".
- Controle de reanálise via Data Table.

### Workflow 3 — Inteligência comercial
- Indicadores por mês, canal e produto, projeção de 3 meses, relatório e consultoria com IA, Google Sheets e dashboard por e-mail.

### Conhecido
- Pendências e divergências documentadas em `docs/analise-tecnica.md` (A1–A13).

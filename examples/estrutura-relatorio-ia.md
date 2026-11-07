# Estrutura do parecer de viabilidade (Workflow 2)

Este arquivo descreve a **estrutura exigida** pelo prompt do nó `Montar Prompt IA`. Não é uma saída real do modelo: pareceres reais contêm dados de clientes e não são publicados.

1. **Resumo executivo**: produto, quantidade, cliente, valor, prazo e cenário geral.
2. **Vantagens do negócio**: fatores financeiros, comerciais e operacionais, só os justificados pelos dados.
3. **Desvantagens do negócio**: limitações econômicas, técnicas e dependências.
4. **Análise financeira**: valor bruto, taxas, valor líquido, custo, lucro, margem sobre o líquido e inconsistências.
5. **Análise de produção**: horas totais, filamento, complexidade, desperdício, dependência de arquivos e capacidade (se informada).
6. **Prazos e entregas**: data de entrega reproduzida literalmente e comparada às horas de produção.
7. **Pontos de atenção**: cada risco com criticidade (Alta, Média ou Baixa), motivo, impacto e ação preventiva.
8. **Dados faltantes ou inconsistentes**: o que confirmar antes de aprovar.
9. **Recomendações práticas**: em ordem de prioridade, para vendas e produção.
10. **Parecer final**: `FAVORÁVEL` · `FAVORÁVEL COM RESSALVAS` · `NÃO RECOMENDADO` · `DADOS INSUFICIENTES`, com justificativa.

Fecha com uma **conclusão executiva** de até três frases.

Para testar: gere a análise sobre um negócio criado a partir de [`ficha-pedido-ficticia.pdf`](ficha-pedido-ficticia.pdf) em uma conta de testes.

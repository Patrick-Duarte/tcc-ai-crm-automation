# Integração com o Google Gemini

Os três workflows usam o nó **Google Gemini** do n8n (Workflow 1: `gemini-3.5-flash-lite`; Workflows 2 e 3: `gemini-3.1-flash-lite`), com credencial própria, que não está nos exports.

| Uso | Workflow | Entrada | Saída esperada | Validação no n8n |
|---|---|---|---|---|
| Extração estruturada | 1 | Texto do PDF da ficha | JSON com 35 campos fixos | `Validar Dados do Pedido` |
| Parecer de viabilidade | 2 | Solicitação da demanda (texto) | Relatório em 10 seções | — (texto livre) |
| Relatório executivo | 3 | Indicadores calculados no n8n | Relatório em 8 seções | Verifica texto não vazio |
| Consultoria de vendas | 3 | Rankings e histórico | JSON `{ resumo, recomendacoes[], alertas[] }` | `Validar Consultoria IA` |

## Princípio de projeto: o cálculo é do código, a interpretação é da IA

Valores financeiros, projeções e rankings são **calculados em JavaScript** antes de chegar ao modelo. O Gemini recebe os números prontos e a instrução explícita de não alterá-los. A IA só interpreta, contextualiza e recomenda. Isso reduz alucinações numéricas e torna o resultado auditável.

## 1. Extração da ficha (Workflow 1)

Regras do prompt: usar só o que está no PDF, `null` para o que faltar, valores monetários como decimais, datas `YYYY-MM-DD`, quantidades inteiras e resposta exclusivamente em JSON. Exemplo do JSON esperado para a ficha fictícia: [`examples/pedido-ficticio.json`](../examples/pedido-ficticio.json).

O nó de validação (v2) remove cercas de Markdown, faz o parse, normaliza o tipo de cliente (`Empresa`/`PJ` ou `Pessoa Física`/`PF`) e marca o pedido como `REVISAR` quando:

- falta algum campo obrigatório: `numeroPedido`, `dataAbertura`, `tipoCliente`, `contatoResponsavel`, `email`, `produto`, `quantidade`, `valorTotalVenda` e `prazoEntrega`, mais `empresa` e `cnpj` quando o cliente é Empresa;
- o tipo de cliente não é reconhecido;
- a quantidade não é positiva, ou o valor total é inválido.

> A conferência `precoVendaUnitario × quantidade = valorTotalVenda`, que existia na v1, não está na v2 (achado A14 da [análise técnica](analise-tecnica.md)).

## 2. Parecer de viabilidade (Workflow 2)

O modelo atua como "analista sênior de viabilidade comercial, financeira e operacional", com regras de precisão. Estrutura completa em [`examples/estrutura-relatorio-ia.md`](../examples/estrutura-relatorio-ia.md).

## 3. Regras de qualidade aprendidas nos testes

Os testes revelaram interpretações erradas, que viraram regras do prompt:

- reproduzir a data de entrega **exatamente** como está na solicitação;
- não deduzir densidade, robustez ou dificuldade de impressão só pelo peso;
- não presumir fraude por características do nome ou do e-mail; recomendar conferência administrativa;
- comparar peso unitário × quantidade com o peso total e apontar a diferença sem assumir a causa;
- não declarar capacidade produtiva suficiente sem dados de ocupação;
- não descontar taxas ou custos duas vezes;
- diferenciar fatos, estimativas e hipóteses.

## 4. Consultoria de vendas (Workflow 3)

Classifica produtos em **INVESTIR · TESTAR · MANTER · REDUZIR**, com justificativa, ação e nível de confiança. O nó de validação aceita só as quatro classes e os produtos que existem no ranking real. Os demais itens vão para uma lista de revisão.

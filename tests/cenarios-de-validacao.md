# Cenários de validação

Legenda: ✅ executado com sucesso · ⏳ pendente · 🔧 depende de correção (ver [análise técnica](../docs/analise-tecnica.md))

## Calculadora

| # | Cenário | Resultado esperado | Status |
|---|---|---|---|
| C1 | Peça de 250 g, 4 h, 5 un., margem fixa 60%, taxa 20% + R$ 4 | Custo R$ 49,29 · preço R$ 103,90 · lucro R$ 29,83 por unidade, com valores iguais na tela e na ficha | ✅ |
| C2 | Ficha sem nome, produto ou contato | Mensagem de campo obrigatório; nenhum PDF gerado | ✅ |
| C3 | Empresa com CNPJ diferente de 14 dígitos | Bloqueio na tela e no servidor | ✅ |
| C4 | Ficha com observações longas | Quebra de linha e segunda página quando necessário | ✅ |
| C5 | PDF do cliente no celular | Compartilhamento nativo com o arquivo anexado | ⏳ teste manual em aparelho |

## Workflow 1 — Cadastro por PDF

| # | Cenário | Resultado esperado | Status |
|---|---|---|---|
| W1.1 | Ficha válida, empresa nova, responsável novo, produto existente | Empresa, contato e negócio criados com os campos mapeados | ✅ |
| W1.2 | Produto inexistente | Opção criada e ID usado no negócio | ⏳ teste isolado |
| W1.3 | Empresa já cadastrada | Reutilizar a empresa | 🔧 A1, A2 |
| W1.4 | Contato já cadastrado | Reutilizar o contato | 🔧 A2 |
| W1.5 | Pessoa física | Contato e negócio criados | ⏳ código da v2 validado com pedido fictício (status `VALIDADO`, corpo do negócio com 12 campos); falta execução no Ploomes |
| W1.6 | Ficha com total incoerente | `REVISAR`, nenhum registro criado | 🔧 A4, A14 |
| W1.7 | Mesma ficha enviada duas vezes | Segundo envio recusado | 🔧 A5 |
| W1.8 | Persistência de cada campo personalizado | Todos os campos visíveis no negócio | ⏳ conferência campo a campo |

## Workflow 2 — Análise de viabilidade

| # | Cenário | Resultado esperado | Status |
|---|---|---|---|
| W2.1 | Negócio novo com solicitação | Parecer gravado em "Análise IA" e registro de controle criado | ✅ |
| W2.2 | Mesma solicitação na execução seguinte | `precisaAnalise = false`, sem nova chamada ao Gemini | ⏳ |
| W2.3 | Solicitação alterada | Nova análise (`ALTERADO`) | ⏳ |
| W2.4 | Vários negócios novos ao mesmo tempo | Um parecer por negócio, sem misturar dados | 🔧 A10 |
| W2.5 | Persistência do texto após o PATCH | Texto visível no negócio (a resposta da API não traz `OtherProperties`) | ⏳ |

## Workflow 3 — Inteligência comercial

| # | Cenário | Resultado esperado | Status |
|---|---|---|---|
| W3.1 | Execução completa | Abas atualizadas e e-mail com dashboard anexo | ⏳ confirmar com a versão atual |
| W3.2 | Pedido com produtos `5x A;1x B` e quantidade 6 | Entra no ranking | ✅ (lógica) |
| W3.3 | Pedido com quantidade divergente | Fora do ranking e listado na auditoria | ✅ (lógica) |
| W3.4 | Menos de 3 meses completos | Sem projeção, com o método "Dados históricos insuficientes" | ✅ (lógica) |
| W3.5 | Integração com os novos campos de custo e lucro | Rentabilidade real nos relatórios | ⏳ evolução futura |

## Precisão da IA (backlog)

- No teste de análise, o modelo afirmou que "todos os totais coincidem" apesar de uma diferença de R$ 0,01 entre custo unitário × quantidade e custo total. A diferença vem do arredondamento por unidade. Ação: instruir o modelo a reportar diferenças de arredondamento como tal, ou enviar a conferência já calculada pelo n8n.

# Análise técnica: implementação × especificação

Revisão feita sobre os **exports reais** dos workflows, que são a fonte de verdade da arquitetura executável, comparados com a documentação de projeto. O objetivo é registrar de forma honesta o que já funciona, o que diverge e o que ainda é risco.

## Achados

| # | Workflow | Achado | Impacto | Recomendação | Prioridade |
|---|---|---|---|---|---|
| A1 | 1 | Busca e criação de empresa usam o campo `Register` para o CNPJ. Na API do Ploomes, `Register` corresponde a **CPF**; o CNPJ fica no campo `CNPJ` | Empresas já cadastradas tendem a não ser encontradas, o que gera duplicidade | Usar `CNPJ` no `$filter` e no `POST /Contacts` | Alta |
| A2 | 1 | As saídas "empresa encontrada" (`If`) e "contato existe" (`Contato existe?`) não estão conectadas | Pedido de cliente recorrente encerra sem criar negócio | Implementar o padrão "resolver ou criar": cada ramo termina num nó que devolve o ID e converge para um único "Criar negócio" (2ª fase planejada) | Alta |
| A3 | 1 | ~~O ramo **Pessoa Física** referencia o nó legado `Code in JavaScript` e a validação exige `empresa`/`cnpj` para todos~~ | — | **Resolvido na v2**: o ramo passou a usar `Validar Dados do Pedido`, e `empresa`/`cnpj` são obrigatórios só para `Empresa` | ✅ |
| A4 | 1 | `statusValidacao = REVISAR` só interrompe o fluxo no nó "Criar negocio Ploomes" | A opção de produto e a empresa podem ser criadas mesmo para um pedido inválido | Inserir um `If` logo após a validação | Alta |
| A5 | 1 | Não há verificação de duplicidade da ficha (mesmo número enviado duas vezes) | Negócios duplicados | Buscar negócio pelo título/código antes de criar | Alta |
| A6 | 1 | O negócio é vinculado à empresa (`ContactId`), mas o responsável não é informado em `PersonId` | Contato do negócio incompleto | Incluir `PersonId` com o ID do responsável | Média |
| A7 | 1 | "Canal de venda" é sempre gravado como **Venda direta**, qualquer que seja o canal da ficha | Distorce os relatórios por canal (Workflow 3) para pedidos de marketplace | Mapear o canal extraído para a opção correspondente | Média |
| A8 | 1 | "Tempo total de impressão" é enviado como `IntegerValue` | Horas fracionadas (ex.: 22,5 h) podem ser rejeitadas ou truncadas | Arredondar explicitamente ou usar campo decimal | Média |
| A9 | Calculadora → 1 | A ficha mostra o peso total em **kg com uma casa decimal** (ex.: 1,3 kg para 1.275 g) | A IA encontra "divergências" de dezenas de gramas que vêm só do arredondamento; é a causa provável da diferença de 50 g observada no teste | Exibir o peso total em gramas na ficha | Média |
| A10 | 2 | `Montar Prompt IA` grava o parecer no **primeiro** negócio pendente, mas inclui **todos** os pendentes no prompt | Com vários orçamentos novos ao mesmo tempo, a análise de um pode citar dados de outro; os demais ficam para as próximas execuções | Processar um negócio por item (Loop/Split) e enviar os outros só como contexto rotulado | Média |
| A11 | 2 | Execução a cada minuto, lendo até 100 negócios | Consumo desnecessário da API | Intervalo de 5 a 15 min, ou disparo por webhook do Ploomes | Baixa |
| A12 | 2 | O nó `If` ainda carrega um `rightValue` residual (ignorado pelo operador booleano) | Nenhum (limpeza) | Remover o valor | Baixa |
| A14 | 1 | A v2 da validação deixou de conferir `precoVendaUnitario × quantidade` contra o total da venda (conferência que existia na v1) | Um total extraído errado pela IA pode chegar ao `Amount` e ao lucro do negócio | Reincluir a conferência, com tolerância de R$ 0,02, como alerta que leva a `REVISAR` | Média |
| A13 | 1 | Nós legados (formulários da v1) e utilitários sem conexão permanecem no workflow | Confusão na manutenção | Mover para um workflow "utilitários" ou remover | Baixa |

> Os exports deste repositório estão **exatamente como em produção** (apenas sanitizados). O Workflow 1 está na **v2**. As correções acima não foram aplicadas, porque alterar os workflows de produção depende de autorização e de testes em conta separada.

## Pontos fortes observados

- **Separação entre cálculo e interpretação**: números são calculados em JavaScript; a IA recebe os valores prontos e a regra de não alterá-los.
- **Validação da saída da IA** antes de qualquer gravação (JSON parse, campos obrigatórios, coerência aritmética, lista branca de produtos e classes).
- **Controle de reanálise** com Data Table, que evita chamadas repetidas ao Gemini para textos inalterados.
- **Auditoria de dados** no Workflow 3: pedidos com quantidades divergentes são excluídos do ranking e reportados.
- **Prompts iterados com base em erros reais**, transformados em regras explícitas.
- **Recálculo no servidor** na calculadora: os documentos internos não confiam no navegador.

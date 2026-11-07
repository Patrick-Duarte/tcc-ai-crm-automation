# Mapeamento de campos e marcadores

Os exports usam **marcadores** no lugar dos IDs reais da conta Ploomes, da planilha e da Data Table. Antes de usar os workflows em outra conta, substitua cada marcador pelo valor correspondente da sua instalação.

## Funil, etapa e tabelas

| Marcador | Significado |
|---|---|
| `1000001` | `PipelineId` do funil "Impressão 3D" |
| `1000002` | `StageId` da etapa inicial "Orçamentos Solicitados" |
| `3000001` | `OptionsTableId` do campo "Produto da venda" |
| `3000002` | `OptionsTableId` do campo "Canal de venda" |
| `2000001`…`2000004` | IDs das opções de canal (ver [regras de negócio](regras-de-negocio.md#canais-de-venda)) |

## Campos personalizados do negócio (FieldKey)

| Campo | Tipo de valor | Marcador `FieldKey` |
|---|---|---|
| Solicitação da demanda | `BigStringValue` | `deal_00000000-0000-0000-0000-000000000001` |
| Análise IA | `BigStringValue` | `deal_00000000-0000-0000-0000-000000000002` |
| Canal de venda | `IntegerValue` (opção) | `deal_00000000-0000-0000-0000-000000000003` |
| Qtd Itens | `IntegerValue` | `deal_00000000-0000-0000-0000-000000000004` |
| Valor dos produtos | `DecimalValue` | `deal_00000000-0000-0000-0000-000000000005` |
| Valor fechado | `DecimalValue` | `deal_00000000-0000-0000-0000-000000000006` |
| Total de taxas | `DecimalValue` | `deal_00000000-0000-0000-0000-000000000007` |
| Data do Pedido | `DateTimeValue` | `deal_00000000-0000-0000-0000-000000000008` |
| Produto da venda | `IntegerValue` (opção) | `deal_00000000-0000-0000-0000-000000000009` |
| Data para entrega | `DateTimeValue` | `deal_00000000-0000-0000-0000-000000000010` |
| Custo de Produção | `DecimalValue` | `deal_00000000-0000-0000-0000-000000000011` |
| Lucro estimado | `DecimalValue` | `deal_00000000-0000-0000-0000-000000000012` |
| Tempo Total de Impressão (h) | `IntegerValue` | `deal_00000000-0000-0000-0000-000000000013` |

## Campos por FieldId (Workflow 3)

O Workflow 3 lê os campos pelo `FieldId`. Os marcadores seguem o padrão `400004xx`:

| Marcador | Campo |
|---|---|
| `40000420` | Nro Pedido |
| `40000421` | Canal de venda |
| `40000422` | Situação |
| `40000423` | Produto da venda |
| `40000424` | Qtd Itens |
| `40000425` | Valor dos produtos |
| `40000426` | Desconto |
| `40000427` | Frete cobrado |
| `40000428` | Outras despesas |
| `40000429` | Comissão |
| `40000430` | Valor fechado (bruto) |
| `40000431` | Custo do frete |
| `40000432` | Total de taxas |
| `40000446` | Data do Pedido |

## Outros recursos

| Marcador | Onde | O que configurar |
|---|---|---|
| `SEU_GOOGLE_SHEET_ID` | Workflow 3, nós do Google Sheets | ID da planilha com as abas `Relatorios_IA`, `Indicadores`, `Produtos` e `Vendas` |
| `SEU_DATA_TABLE_ID` | Workflow 2 | Data Table do n8n com as colunas `negocioId` (number), `solicitacaoAnterior` (string) e `dataAnalise` (dateTime) |
| `seu-email@exemplo.com` | Workflow 3, nó Gmail | Destinatários do dashboard |

Para descobrir os IDs da sua conta, execute manualmente os nós "Consultar Campos de Vendas" e "Consultar Opções de Canal" do Workflow 1.

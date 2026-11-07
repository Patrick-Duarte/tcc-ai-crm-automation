# Integração com o Ploomes CRM

API: `https://public-api2.ploomes.com` (REST + OData v4).

## Autenticação

Todas as chamadas usam o cabeçalho `User-Key`, configurado no n8n como credencial **Header Auth**. A chave **não** está nos exports. Ao importar, o n8n pede a credencial de cada nó HTTP. Recomenda-se uma chave de um **usuário de integração**, e não de um usuário pessoal.

## Endpoints utilizados

| Método | Endpoint | Workflow | Uso |
|---|---|---|---|
| GET | `/Fields@OptionsTables?$filter=Id eq {tabela}&$expand=Options` | 1 | Lista as opções do campo "Produto da venda" |
| POST | `/Fields@OptionsTables@Options` | 1 | Cria uma opção de produto `{ TableId, Name }` |
| GET | `/Contacts?$filter=TypeId eq 1 and ...` | 1 | Busca empresa |
| POST | `/Contacts` (`TypeId: 1`) | 1 | Cria empresa |
| GET | `/Contacts?$filter=TypeId eq 2 and Email eq '...'` | 1 | Busca pessoa por e-mail (aspas simples escapadas) |
| POST | `/Contacts` (`TypeId: 2`, `CompanyId`) | 1 | Cria responsável vinculado à empresa |
| POST | `/Deals` | 1 | Cria o negócio |
| GET | `/Deals?$filter=PipelineId eq {funil} and StatusId eq 1&$expand=OtherProperties` | 2 | Orçamentos abertos |
| PATCH | `/Deals({id})` | 2 | Grava o parecer da IA |
| GET | `/Fields?$filter=EntityId eq 2 and Dynamic eq true` | 3 | Campos personalizados de negócio |
| GET | `/Deals?$filter=... and StatusId eq 2` (paginação `$skip`) | 3 | Negócios ganhos |

`StatusId`: 1 = aberto, 2 = ganho, 3 = perdido.

## Payload do negócio

Exemplo gerado pelo próprio código do nó "Criar negocio Ploomes" com dados fictícios: [`examples/payload-negocio-ficticio.json`](../examples/payload-negocio-ficticio.json).

```json
{
  "Title": "RG-261107-024952 - Suporte de parede para controle remoto",
  "ContactId": 123456,
  "Amount": 323.14,
  "PipelineId": 1000001,
  "StageId": 1000002,
  "OtherProperties": [
    { "FieldKey": "deal_...0004", "IntegerValue": 8 },
    { "FieldKey": "deal_...0005", "DecimalValue": 367.2 },
    { "FieldKey": "deal_...0001", "BigStringValue": "PEDIDO: RG-..." }
  ]
}
```

Campos personalizados entram em `OtherProperties`, com o tipo correto: `IntegerValue` (inteiros e IDs de opção), `DecimalValue` (moeda), `DateTimeValue` (`YYYY-MM-DDT00:00:00`) e `BigStringValue` (texto longo).

## Dependências da instalação

IDs de funil, etapa, campos, tabelas de opções e opções de canal são **específicos de cada conta Ploomes**. Neste repositório eles foram trocados por marcadores. Veja [mapeamento-campos.md](mapeamento-campos.md) e use os nós utilitários "Consultar Campos de Vendas" e "Consultar Opções de Canal" para descobrir os IDs da sua conta.

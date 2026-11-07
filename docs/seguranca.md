# Segurança e dados

## O que foi removido ou substituído nos exports

| Item | Tratamento |
|---|---|
| Credenciais (IDs e nomes de Ploomes, Gemini, Sheets e Gmail) | Removidas: o n8n pede as credenciais na importação |
| `meta.instanceId`, `id` e `versionId` do workflow | Removidos |
| `webhookId` do formulário e do Gmail | Substituídos por UUIDs novos: a URL de produção não é exposta |
| `pinData` (dados de execuções) | Esvaziado |
| IDs de funil, etapa, campos, tabelas de opções e opções de canal | Substituídos por marcadores ([mapeamento](mapeamento-campos.md)) |
| ID e URLs da planilha Google | `SEU_GOOGLE_SHEET_ID` |
| ID da Data Table e do projeto n8n | `SEU_DATA_TABLE_ID` |
| E-mails de destinatários | `seu-email@exemplo.com` |
| IDs de negócios reais usados em testes | Removidos |
| `active` | `false` |

## O que nunca entra no repositório

- User-Key do Ploomes, chave do Gemini, tokens OAuth;
- PDFs, fichas ou exports de clientes reais;
- números de vendas, faturamento ou relatórios gerados;
- URLs de webhook de produção e segredos de webhook;
- arquivos `.env` (só `.env.example`, com valores vazios).

Todos os exemplos em `examples/` foram gerados a partir de dados **fictícios**: empresa "Oficina Exemplo Ltda", CNPJ público de teste `11.222.333/0001-81` e domínio `exemplo.com.br`.

## Como exportar uma nova versão de workflow com segurança

1. Exporte o workflow no n8n.
2. Rode `python3 scripts/limpar-export-n8n.py entrada.json saida.json`. O script remove credenciais, metadados, `pinData`, URLs em cache e e-mails, e troca os `webhookId`.
3. Substitua manualmente os IDs da conta pelos marcadores.
4. Rode `bash scripts/verificar-segredos.sh` antes do commit.

## Se um segredo vazar

Apagar o arquivo **não basta**: o segredo continua no histórico do Git. Revogue ou troque a chave imediatamente no serviço de origem e, depois, limpe o histórico (por exemplo, com `git filter-repo`).

## Segurança da aplicação

- A calculadora recalcula o preço no servidor: valores editados no navegador não chegam aos documentos internos.
- Todas as entradas da função são truncadas e validadas (CNPJ com 14 dígitos, e-mail, datas `YYYY-MM-DD`).
- O dashboard HTML do Workflow 3 escapa todo texto dinâmico e sanitiza o Markdown gerado pela IA com DOMPurify.

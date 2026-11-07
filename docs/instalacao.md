# Instalação

## Pré-requisitos

- Conta na **Vercel** (o plano Hobby atende ao uso acadêmico; uso comercial exige o plano Pro)
- **n8n** acessível pela internet, se for receber chamadas externas (n8n Cloud, VPS ou túnel)
- Conta **Ploomes** com uma User-Key de integração
- Chave de API do **Google Gemini**
- Google Sheets e Gmail conectados ao n8n (Workflow 3)

## 1. Calculadora (Vercel)

1. Importe este repositório na Vercel.
2. Em **Root Directory**, informe `calculadora`.
3. Framework Preset: **Other**. Não há etapa de build: a Vercel instala o `jspdf` pelo `package.json` e publica `api/` como funções.
4. Variáveis de ambiente: nenhuma é necessária para os PDFs. `N8N_WEBHOOK_URL` e `N8N_SECRET` só são usadas pela integração direta, hoje desativada (veja [`calculadora/.env.example`](../calculadora/.env.example)).
5. Faça o deploy. A partir daí, cada `git push` na `main` publica uma nova versão.

Para rodar localmente:

```bash
cd calculadora
npm install
npx vercel dev
```

## 2. Workflows (n8n)

1. No n8n: **Workflows → Import from File** e importe cada arquivo de `workflows/`.
2. Crie as credenciais e associe-as a cada nó que pedir:
   - **Header Auth** chamada "Ploomes", com o nome `User-Key` e a sua chave;
   - **Google Gemini (PaLM) API**;
   - **Google Sheets** e **Gmail** (Workflow 3).
3. Substitua os marcadores conforme [mapeamento-campos.md](mapeamento-campos.md).
4. Crie a Data Table de controle do Workflow 2.
5. Teste com a ficha fictícia [`examples/ficha-pedido-ficticia.pdf`](../examples/ficha-pedido-ficticia.pdf) **em uma conta de testes**, nunca na conta de produção.
6. Ative os workflows. Os exports vêm com `active: false`.

> O Workflow 2 roda **a cada minuto**. Em contas com muitos negócios abertos, avalie um intervalo maior por causa do limite de requisições da API.

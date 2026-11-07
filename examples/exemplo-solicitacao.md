# Exemplo: "Solicitação da demanda"

Texto gravado no campo **Solicitação da demanda** pelo nó `Criar negocio Ploomes` do Workflow 1. Foi gerado **executando o código real do nó** sobre o JSON fictício [`pedido-ficticio.json`](pedido-ficticio.json), extraído da [`ficha-pedido-ficticia.pdf`](ficha-pedido-ficticia.pdf). Todos os dados são fictícios.

```text
PEDIDO: RG-261107-024952
STATUS: AGUARDANDO ORÇAMENTO

DADOS DO CLIENTE
Tipo: Empresa
Empresa: Oficina Exemplo Ltda
CNPJ: 11.222.333/0001-81
Responsável: Fulano de Tal
E-mail: contato@exemplo.com.br
WhatsApp: 11900000000

DADOS DO PEDIDO
Produto: Suporte de parede para controle remoto
Quantidade: 8
Canal: WhatsApp
Data do pedido: 2026-11-07
Entrega prevista: 2026-12-04
Arquivo: https://exemplo.com/modelo-suporte.3mf
Observações: Cor preta, logotipo em relevo (dados fictícios)

PRODUÇÃO
Peso unitário: 60 g
Peso total: 500 g
Impressão por unidade: 2.5 h
Impressão total: 20 h
Custo hora-máquina: R$ 1,95

COMPOSIÇÃO FINANCEIRA
Filamento por unidade: R$ 5,99
Máquina por unidade: R$ 4,88
Reserva de falhas: R$ 1,09
Mão de obra: R$ 4,17
Embalagem: R$ 2,00
Custo unitário: R$ 18,11
Preço unitário: R$ 45,90

TOTAIS
Venda bruta: R$ 367,20
Taxas: R$ 44,06
Valor líquido: R$ 323,14
Custo de produção: R$ 144,91
Lucro estimado: R$ 178,23
```

Repare que o peso total aparece como 500 g, porque a ficha mostra "0,5 kg" (60 g × 8 un. + 5% = 504 g). Esse arredondamento é o achado A9 da [análise técnica](../docs/analise-tecnica.md).

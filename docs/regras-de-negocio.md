# Regras de negócio

## Valores do negócio no Ploomes

| Grandeza | Fórmula | Onde fica |
|---|---|---|
| Venda bruta | preço unitário × quantidade | campos "Valor dos produtos" e "Valor fechado" |
| Taxas do canal | soma das taxas do marketplace | campo "Total de taxas" |
| **Valor líquido** | venda bruta − taxas | campo nativo **`Amount`** |
| Custo de produção | custo unitário × quantidade | campo "Custo de produção" |
| Lucro estimado | valor líquido − custo de produção | campo "Lucro estimado" |
| Margem sobre o líquido | lucro ÷ valor líquido × 100 | calculada na análise |

Regras:

- o `Amount` é o **valor líquido**. O custo de produção fica em campo separado e **não** é descontado de novo do `Amount`;
- quando o denominador da margem é zero, negativo ou ausente, o cálculo deve ser tratado explicitamente, sem gerar uma margem enganosa;
- **recebimento líquido não é lucro**: os relatórios do Workflow 3 deixam essa diferença explícita.

## Identificação do pedido

- O **título** do negócio é `código da ficha - produto`, por exemplo `RG-261107-024952 - Suporte de parede para controle remoto`.
- O campo "Nro Pedido" fica reservado ao número do ERP e **não** recebe o código da ficha.
- A data oficial da venda, nos relatórios, é o campo "Data do Pedido".

## Canais de venda

| Canal | Marcador da opção |
|---|---|
| Shopee (loja 1) | `2000001` |
| Shopee (loja 2) | `2000002` |
| Mercado Livre | `2000003` |
| Venda direta | `2000004` |

Pedidos recebidos pelo WhatsApp são classificados como **Venda direta**, e o canal original continua registrado no texto da solicitação.

## Estados de negócio nos relatórios

| Estado | Significado | Entra no faturamento? |
|---|---|---|
| Aberto | Orçamento em negociação | Não |
| Ganho | Venda confirmada, compromisso de produção | Sim |
| Perdido | Oportunidade descartada | Não |

## Produtos

A opção de "Produto da venda" é reaproveitada quando o nome normalizado coincide (sem acentos, caixa ou espaços duplicados). Caso contrário, uma nova opção é criada.

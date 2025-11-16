# Análise de Problemas na Tabela Comparativa

## Estrutura do Excel (DIFERENÇA.xlsx)

### Aba: DIFERENÇA
- **Coluna H**: PARCELA (1-88)
- **Coluna I**: VENCIMENTO (datas mensais)
- **Coluna J**: PRICE (valor fixo 2056.30)
- **Coluna K**: MQJS (valor fixo 1951.42)
- **Coluna L**: DIFERENÇA (PRICE - MQJS = 104.88)
- **Coluna M**: IPCA ACUMULADO (fator de correção desde vencimento até hoje)
- **Coluna N**: PARCELA DEVIDA (DIFERENÇA × IPCA ACUMULADO)

### Dados de Exemplo (Primeiras 10 parcelas)
```
Parcela | Vencimento  | PRICE  | MQJS    | Diferença | IPCA Acum | Parcela Devida
1       | 2022-08-01  | 2056.3 | 1951.42 | 104.88    | 1.1475    | 120.35
2       | 2022-09-01  | 2056.3 | 1951.42 | 104.88    | 1.1517    | 120.79
3       | 2022-10-01  | 2056.3 | 1951.42 | 104.88    | 1.1550    | 121.14
...
```

### Data de Referência
- **Data Atual**: 2025-09-30
- **IPCA Acumulado Total**: 2.4383 (desde a primeira parcela)

## Problemas Identificados

### 1. Carregamento Infinito
- A mutation `calcularDiferencaCorrigida` está sendo chamada para cada parcela
- Sem tratamento de erro adequado
- Sem limite de tentativas

### 2. Lógica de Cálculo Incorreta
- Atual: Tenta corrigir cada valor (PRICE e MQJS) individualmente
- Correto: Calcular diferença (PRICE - MQJS) e depois corrigir a diferença

### 3. Fator de Correção Incorreto
- Atual: Usa fator de correção do vencimento até hoje
- Correto: Usar índice acumulado do último dia do mês anterior ao vencimento até hoje

### 4. Sem Validação de Dados
- Não valida se os índices existem no banco
- Não trata casos onde não há índice para a data

## Solução Proposta

1. Refatorar para calcular a diferença PRIMEIRO
2. Depois aplicar o fator de correção UMA VEZ
3. Usar índice acumulado correto (último dia do mês anterior)
4. Implementar tratamento de erro robusto
5. Mostrar apenas as parcelas pagas

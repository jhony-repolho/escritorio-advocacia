# Importação de Índices de Correção Monetária

Este documento descreve como importar os índices de correção monetária (INCC e IPCA) para o banco de dados.

## Estrutura Criada

### Tabelas do Banco de Dados

1. **monthly_indices** - Armazena índices mensais
   - `id` (int): Chave primária
   - `indexType` (enum): INCC ou IPCA
   - `date` (varchar): Data no formato YYYY-MM-01
   - `monthlyIndex` (decimal): Variação mensal em %
   - `dailyIndex` (decimal): Variação diária calculada
   - `createdAt` (timestamp): Data de criação

2. **daily_indices** - Armazena índices diários
   - `id` (int): Chave primária
   - `indexType` (enum): INCC ou IPCA
   - `date` (varchar): Data no formato YYYY-MM-DD
   - `dailyIndex` (decimal): Variação diária
   - `accumulated` (decimal): Índice acumulado
   - `createdAt` (timestamp): Data de criação

### API tRPC Criada

Dois endpoints foram criados em `server/routers.ts`:

1. **indices.getMonthly** - Consulta índice mensal
   ```typescript
   input: { indexType: "INCC" | "IPCA", date: "YYYY-MM-01" }
   output: MonthlyIndex | undefined
   ```

2. **indices.getDaily** - Consulta índice diário
   ```typescript
   input: { indexType: "INCC" | "IPCA", date: "YYYY-MM-DD" }
   output: DailyIndex | undefined
   ```

## Como Importar os Dados

### Opção 1: Script Node (Recomendado)

Os arquivos Excel já foram extraídos para JSON em `scripts/indices_data.json`.

Execute o script de importação:

```bash
cd /home/ubuntu/escritorio-advocacia
node scripts/import-to-db.js
```

Este script irá:
- Ler os dados de `scripts/indices_data.json`
- Conectar ao banco de dados usando as variáveis de ambiente
- Importar 189 meses + 5752 dias para cada índice (INCC e IPCA)
- Usar `ON DUPLICATE KEY UPDATE` para evitar duplicatas

### Opção 2: Script Python

Um script Python também está disponível:

```bash
python3 scripts/import-indices.py
```

Este script extrai os dados dos arquivos Excel e os salva em JSON.

### Opção 3: Função TypeScript

A função `importIndices` está disponível em `server/db.ts`:

```typescript
import { importIndices } from './server/db';
import data from './scripts/indices_data.json';

await importIndices(data);
```

## Dados Disponíveis

- **Período**: 01/01/2010 até 30/09/2025
- **INCC**: 189 meses, 5752 dias
- **IPCA**: 189 meses, 5752 dias
- **Total**: 11.500+ registros

## Integração com a Calculadora

Após importar os dados, a calculadora revisional poderá:

1. Consultar o índice mensal da data do contrato
2. Consultar o índice diário para cálculos precisos
3. Calcular a correção monetária acumulada
4. Exibir resultados da análise revisional

## Próximos Passos

1. Execute o script de importação
2. Verifique se os dados foram importados corretamente:
   ```sql
   SELECT COUNT(*) FROM monthly_indices;
   SELECT COUNT(*) FROM daily_indices;
   ```
3. Teste a API:
   ```typescript
   const index = await trpc.indices.getMonthly.query({
     indexType: "INCC",
     date: "2010-01-01"
   });
   ```
4. Integre com a calculadora revisional no frontend

## Troubleshooting

### Erro de conexão ao banco de dados

Verifique as variáveis de ambiente:
- `DATABASE_URL` ou `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### Dados não aparecem após importação

Verifique se o arquivo `scripts/indices_data.json` existe e contém dados válidos.

### Performance lenta

A importação de 11.500+ registros pode levar alguns minutos. Considere usar transações em lote para melhorar a performance.

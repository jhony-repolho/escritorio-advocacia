import openpyxl from 'openpyxl';
import { getDb } from '../server/db';
import { monthlyIndices, dailyIndices } from '../drizzle/schema';
import * as fs from 'fs';

async function importIndices() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  const files = [
    { name: 'INCC', path: '/home/ubuntu/upload/INCC.xlsx' },
    { name: 'IPCA', path: '/home/ubuntu/upload/IPCA.xlsx' }
  ];

  for (const file of files) {
    console.log(`\nImporting ${file.name}...`);

    try {
      // Read the JSON file we created earlier
      const jsonPath = '/tmp/indices_data.json';
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const indexData = jsonData[file.name.toLowerCase()];

      // Import monthly data
      console.log(`  Importing ${indexData.monthly.length} monthly records...`);
      for (const record of indexData.monthly) {
        await db.insert(monthlyIndices).values({
          indexType: file.name as 'INCC' | 'IPCA',
          date: record.date,
          monthlyIndex: record.monthly_index.toString(),
          dailyIndex: record.daily_index.toString(),
        }).onDuplicateKeyUpdate({
          set: {
            monthlyIndex: record.monthly_index.toString(),
            dailyIndex: record.daily_index.toString(),
          }
        });
      }

      // Import daily data
      console.log(`  Importing ${indexData.daily.length} daily records...`);
      for (const record of indexData.daily) {
        await db.insert(dailyIndices).values({
          indexType: file.name as 'INCC' | 'IPCA',
          date: record.date,
          dailyIndex: record.daily_index.toString(),
          accumulated: record.accumulated.toString(),
        }).onDuplicateKeyUpdate({
          set: {
            dailyIndex: record.daily_index.toString(),
            accumulated: record.accumulated.toString(),
          }
        });
      }

      console.log(`  ✓ ${file.name} imported successfully`);
    } catch (error) {
      console.error(`  ✗ Error importing ${file.name}:`, error);
    }
  }

  console.log('\nImport completed!');
  process.exit(0);
}

importIndices().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

import fs from 'fs';
import mysql from 'mysql2/promise';

const data = JSON.parse(fs.readFileSync('/home/ubuntu/escritorio-advocacia/scripts/indices_data.json', 'utf-8'));

async function importData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'escritorio_advocacia',
  });

  try {
    console.log('Importing INCC monthly data...');
    for (const record of data.incc.monthly) {
      await connection.execute(
        `INSERT INTO monthly_indices (indexType, date, monthlyIndex, dailyIndex) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE monthlyIndex=?, dailyIndex=?`,
        ['INCC', record.date, record.monthly_index.toString(), record.daily_index.toString(), 
         record.monthly_index.toString(), record.daily_index.toString()]
      );
    }

    console.log('Importing INCC daily data...');
    for (const record of data.incc.daily) {
      await connection.execute(
        `INSERT INTO daily_indices (indexType, date, dailyIndex, accumulated) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE dailyIndex=?, accumulated=?`,
        ['INCC', record.date, record.daily_index.toString(), record.accumulated.toString(),
         record.daily_index.toString(), record.accumulated.toString()]
      );
    }

    console.log('Importing IPCA monthly data...');
    for (const record of data.ipca.monthly) {
      await connection.execute(
        `INSERT INTO monthly_indices (indexType, date, monthlyIndex, dailyIndex) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE monthlyIndex=?, dailyIndex=?`,
        ['IPCA', record.date, record.monthly_index.toString(), record.daily_index.toString(),
         record.monthly_index.toString(), record.daily_index.toString()]
      );
    }

    console.log('Importing IPCA daily data...');
    for (const record of data.ipca.daily) {
      await connection.execute(
        `INSERT INTO daily_indices (indexType, date, dailyIndex, accumulated) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE dailyIndex=?, accumulated=?`,
        ['IPCA', record.date, record.daily_index.toString(), record.accumulated.toString(),
         record.daily_index.toString(), record.accumulated.toString()]
      );
    }

    console.log('Import completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

importData();

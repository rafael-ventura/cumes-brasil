/**
 * Aguarda o Postgres aceitar conexões antes de iniciar o servidor.
 * Uso: node scripts/wait-for-db.js && node dist/Api/server.js
 */
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
  user: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'postgres',
};

const maxTentativas = 30;
const intervaloMs = 2000;

async function aguardar() {
  for (let i = 0; i < maxTentativas; i++) {
    try {
      const client = new Client(config);
      await client.connect();
      await client.end();
      console.log('Postgres pronto!');
      process.exit(0);
    } catch (erro) {
      console.log(`Tentativa ${i + 1}/${maxTentativas} - Postgres ainda não pronto:`, erro.message);
      await new Promise((r) => setTimeout(r, intervaloMs));
    }
  }
  console.error('Timeout: Postgres não respondeu a tempo.');
  process.exit(1);
}

aguardar();

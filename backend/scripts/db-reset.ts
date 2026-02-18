/**
 * Drop + recreate do banco, migrations e seed.
 * Uso: npm run db:reset
 */
import 'reflect-metadata';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const host = process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10);
const user = process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres';
const password = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '';
const dbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'cumes-brasil';

async function reset() {
  const admin = new Client({
    host,
    port,
    user,
    password: password || undefined,
    database: 'postgres'
  });

  try {
    await admin.connect();
    console.log('Conectado ao PostgreSQL...');

    await admin.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`, [dbName]);
    await admin.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Banco "${dbName}" dropado.`);

    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Banco "${dbName}" criado.`);
  } finally {
    await admin.end();
  }
}

reset().catch((err) => {
  console.error('Erro no reset:', err.message);
  process.exit(1);
});

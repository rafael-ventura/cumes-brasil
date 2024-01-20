// executeDDL.ts

import { Database } from 'sqlite3';
import { readFileSync } from 'fs';
import * as path from 'path';

const sqlFilePath = path.join(__dirname, '../../../database/sqlite/scripts/create_database.sql');
const dbFilePath = path.join(__dirname, '../../../database/sqlite/cumes_brasil.db');

const bancoDados = new Database(dbFilePath, (error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('Conectado ao banco de dados SQLite.');
});

const ddl = readFileSync(sqlFilePath, 'utf8');

bancoDados.exec(ddl, (error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('DDL executado com sucesso.');
});

bancoDados.close((error) => {
    if (error) {
        console.error(error.message);
        throw error;
    }
    console.log('Conexão com o banco de dados fechada.');
});


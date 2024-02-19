import sqlite3 from 'sqlite3';
import path from 'path';

function connect() {
    const dbPath = path.join(__dirname, '../../../database/sqlite/cumes_brasil.db');
    console.log(dbPath);
    return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });
}

const dbConnection = connect();
export default dbConnection;

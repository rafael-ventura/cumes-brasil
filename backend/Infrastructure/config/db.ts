import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function connect() {
    return open({
        filename: 'database/sqlite/cumes_brasil.db',
        driver: sqlite3.Database
    });
}

const dbConnection = connect();
export default dbConnection;
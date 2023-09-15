import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'seu_host',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;

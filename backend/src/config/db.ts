import { DocumentStore } from 'ravendb';

// Configure o seu DocumentStore com os detalhes do seu servidor RavenDB
const store = new DocumentStore(['http://localhost:8080'], 'databasename');
store.initialize();

// Agora, você pode usar 'store' para interagir com o RavenDB em seu código

export default store;


/*
* 'MySQL' oldWay
 ----------------------
* import mysql from 'mysql2/promise';

* const pool = mysql.createPool({
    host: 'seu_host',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
* });
export default pool;
*/

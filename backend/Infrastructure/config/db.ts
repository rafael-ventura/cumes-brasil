import { DocumentStore } from 'ravendb';
import * as fs from "fs";


// load certificate and prepare authentication options
const authOptions = {
    certificate: fs.readFileSync("/home/operador/Documents/free.jardineiros.client.certificate.pfx"),
    type: "pfx", // or "pem"
    password: "65AED03F6B2840B3F14FBCAFBAC1319"
};

// Configure o seu DocumentStore com os detalhes do seu servidor RavenDB
const store = new DocumentStore(
    ['https://a.free.jardineiros.ravendb.cloud'],
    'cumes_brasil');
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

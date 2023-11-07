import {DocumentStore, IAuthOptions} from 'ravendb';
import * as fs from "fs";

// Carregar os certificados e a chave privada
const certificate = fs.readFileSync("C:\\Users\\raf4a\\Downloads\\free.jardineiros.client.certificate\\PEM\\free.jardineiros.client.certificate.pem", "utf8");
const privateKey = fs.readFileSync("C:\\Users\\raf4a\\Downloads\\free.jardineiros.client.certificate\\PEM\\free.jardineiros.client.certificate.key", "utf8");

// Preparar as opções de autenticação
const authOptions: IAuthOptions = {
    certificate: certificate + privateKey, // Concatenar certificado e chave privada
    type: "pem",
    // Se houver senha, descomente a linha abaixo e substitua 'sua_senha' pela senha fornecida
    // password: "sua_senha"
};

// Configurar o DocumentStore com os detalhes do seu servidor RavenDB
const store = new DocumentStore(
    'https://a.free.jardineiros.ravendb.cloud', // Substitua pela URL correta
    'cumes_brasil',
    authOptions
);
store.initialize();

export default store;

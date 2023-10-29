import { DocumentStore } from 'ravendb';

// Configure o seu DocumentStore com os detalhes do seu servidor RavenDB
const store = new DocumentStore(['http://localhost:8080'], 'databasename');
store.initialize();

// Agora, você pode usar 'store' para interagir com o RavenDB em seu código

export default store;

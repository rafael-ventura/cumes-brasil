import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from "./routes/routes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const BASE_API_URL = '/api';

app.use(express.json());

// Documentação da API
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Rotas
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

app.use(BASE_API_URL, routes);


// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

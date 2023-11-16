import express from 'express';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/routes';
const swaggerJSDoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuração do Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Escalada',
        version: '1.0.0',
        description: 'Esta é a API para o aplicativo de escalada.',
    },
    servers: [
        {
            url: `http://localhost:${PORT}/api`,
            description: 'Servidor de desenvolvimento',
        },
    ],
};

const options = {
    swaggerDefinition,
    // Caminhos para os arquivos onde o swagger-jsdoc vai ler as anotações
    apis: ['../**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());

// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api', routes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
});


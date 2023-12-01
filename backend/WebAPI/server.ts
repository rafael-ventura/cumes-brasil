import express from 'express';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/routes';


// Importações do ViaService e dos Repositórios
import {MontanhaRepository} from "../Infrastructure/repositories/MontanhaRepository";
import {ViaRepository} from "../Infrastructure/repositories/ViaRepository";
import {InternalService} from '../Application/services/InternalService';
import {FaceRepository} from "../Infrastructure/repositories/FaceRepository";
import {CroquiRepository} from "../Infrastructure/repositories/CroquiRepository";
import {FonteRepository} from "../Infrastructure/repositories/FonteRepository"; // Ajuste conforme necessário

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Inicializando os repositórios
const montanhaRepository = new MontanhaRepository();
const viaRepository = new ViaRepository();
const faceRepository = new FaceRepository(viaRepository);
const fonteRepository = new FonteRepository(viaRepository);
const croquiRepository = new CroquiRepository();


//todo : colocar uma config no appsettings booleano para processar ou não os csvs. Por
// Inicializando o ViaService
const viaService = new InternalService(montanhaRepository, viaRepository, faceRepository, fonteRepository, croquiRepository);

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
    apis: ['../**/*.ts'], // Caminhos para os arquivos onde o swagger-jsdoc vai ler as anotações
};


const swaggerSpec = swaggerUi.setup(swaggerDefinition);

app.use(express.json());

// Documentação da API com Swagger

app.use('/api-docs', swaggerUi.serve, swaggerSpec);

// Rotas
app.use('/api', routes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
    console.log(process.cwd())

     console.log(viaService.processCSVData());
});

import express from 'express';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/routes';
import "reflect-metadata";
import swaggerDocument from "../swagger_output.json";

dotenv.config();

var cors = require('cors')
const app = express();
app.use(cors())
const PORT = process.env.PORT || 4000;



// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());

// Documentação da API com Swagger


// Rotas
app.use('/api', routes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
    console.log(process.cwd())

     /*console.log(viaService.processCSVData());*/
});

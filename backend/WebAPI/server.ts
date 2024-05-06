import * as dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/routes";
import "reflect-metadata";
import swaggerDocument from "../swagger_output.json";
import { AppDataSource } from "../Infrastructure/config/db";

dotenv.config();

const cors = require("cors");
const app = express();
app.use(cors())
const PORT = process.env.PORT || 4020;

// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// Rotas
app.use('/api', routes);

AppDataSource.initialize().then(async () => {
    console.log("Conexão com o banco de dados estabelecida com sucesso");

}).catch(error => console.log(error));

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
    console.log(process.cwd())
    /* initialLoad().then(r => console.log("Carga inicial realizada com sucesso")).catch(e => console.log(e)); */  // TODO: Finalizar tarefa do script de load inicial rsrs
});

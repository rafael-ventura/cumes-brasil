import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

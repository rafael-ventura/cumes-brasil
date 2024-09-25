import { DataSource } from 'typeorm';
import { Via } from '../../Domain/entities/Via';
import { Usuario } from '../../Domain/entities/Usuario';
import { Croqui } from '../../Domain/entities/Croqui';
import { Face } from '../../Domain/entities/Face';
import { Montanha } from '../../Domain/entities/Montanha';
import { Fonte } from '../../Domain/entities/Fonte';
import { Colecao } from '../../Domain/entities/Colecao';
import { Escalada } from '../../Domain/entities/Escalada';
import { Imagem } from '../../Domain/entities/Imagem';
import { Participante } from '../../Domain/entities/Participante';
import { initializeEnvConfig } from './envinronment';

initializeEnvConfig();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    synchronize: true,
    logging: false,
    entities: [
        Colecao,
        Croqui,
        Escalada,
        Face,
        Fonte,
        Imagem,
        Montanha,
        Usuario,
        Via,
        Participante
    ],
    migrations: ['src/Infrastructure/migrations/*.ts'],
    ssl: false // Desabilita SSL
});

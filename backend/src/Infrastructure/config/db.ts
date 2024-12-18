import { DataSource } from 'typeorm';
import { initializeEnvConfig } from './envinronment';
import { Colecao } from '../../Domain/entities/Colecao';
import { Croqui } from '../../Domain/entities/Croqui';
import { Escalada } from '../../Domain/entities/Escalada';
import { Face } from '../../Domain/entities/Face';
import { Fonte } from '../../Domain/entities/Fonte';
import { Imagem } from '../../Domain/entities/Imagem';
import { Montanha } from '../../Domain/entities/Montanha';
import { Usuario } from '../../Domain/entities/Usuario';
import { Via } from '../../Domain/entities/Via';
import { Participante } from '../../Domain/entities/Participante';
import { ViaColecao } from '../../Domain/entities/ViaColecao';

initializeEnvConfig();

export const AppDataSource = new DataSource({
    schema: 'public',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, //MANTER FALSE
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
        Participante,
        ViaColecao
    ],
    migrations: ['dist/Infrastructure/migrations/*.js'],
    ssl: false
});

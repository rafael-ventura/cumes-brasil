import path from "path";
import { DataSource } from "typeorm";
import { Via } from "../../Domain/entities/Via";
import { Usuario } from "../../Domain/entities/Usuario";
import { Croqui } from "../../Domain/entities/Croqui";
import { Face } from "../../Domain/entities/Face";
import { Montanha } from "../../Domain/entities/Montanha";
import { Fonte } from "../../Domain/entities/Fonte";
import { Colecao } from "../../Domain/entities/Colecao";
import { Escalada } from "../../Domain/entities/Escalada";
import { Imagem } from "../../Domain/entities/Imagem";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../../../database/sqlite/cumes_brasil.db"),
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
        Via
    ]
});

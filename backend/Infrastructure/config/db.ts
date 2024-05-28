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
import { ColecaoVia } from "../../Domain/entities/ColecaoVia";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../../../database/sqlite/cumes_brasil.db"),
    synchronize: true,
    logging: false,
    entities: [
        Colecao,
        ColecaoVia,
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

import "reflect-metadata"
import { DataSource } from "typeorm"
import { Via } from "../../Domain/entities/Via"
import { Usuario } from "../../Domain/entities/Usuario"
import { Montanha } from "../../Domain/entities/Montanha"
import { Fonte } from "../../Domain/entities/Fonte"
import { Face } from "../../Domain/entities/Face"
import { Croqui } from "../../Domain/entities/Croqui"
import { ColecaoBase } from "../../Domain/entities/ColecaoBase"
import { ColecaoEscaladas } from "../../Domain/entities/ColecaoEscaladas"
import { ColecaoFavoritos } from "../../Domain/entities/ColecaoFavoritos"

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "cume-brasil",
    entities: [Via, Usuario, Montanha, Fonte, Face, Croqui, ColecaoBase, ColecaoEscaladas, ColecaoFavoritos],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
        //
    })
    .catch((error) => console.log(error))
import path from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "../../../database/sqlite/cumes_brasil.db"),
    synchronize: true,
    logging: false,
    entities: [
        path.join(__dirname, "../../Domain/Entities/*.ts")
    ]
});

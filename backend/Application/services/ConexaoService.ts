import dbConnection from "../../Infrastructure/config/db";
import {Database} from "sqlite3";


export class ConexaoService {
    private db: Database;

    constructor() {
        this.db = dbConnection;
    }

    async healthCheck(): Promise<boolean> {
        try {
            const db = await this.db;
            return new Promise((resolve) => {
                db.get("SELECT 1", (err) => {
                    resolve(!err);
                });
            });
        } catch (error) {
            console.error('Erro ao realizar health check:', error);
            return false;
        }
    }


}
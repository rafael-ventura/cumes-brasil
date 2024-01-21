import { Database } from 'sqlite3';
import dbConnection from '../../Infrastructure/config/db';

export class InternalService {
    private db: Database;

    constructor() {
        this.db = dbConnection;

    }

    healthCheck(): Promise<boolean> {
        return new Promise((resolve) => {
            this.db.get("SELECT 1", (err) => {
                if (err) {
                    console.error('Erro ao realizar health check:', err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

}

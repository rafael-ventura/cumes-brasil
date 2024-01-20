import {Database} from 'sqlite3';
import {Fonte} from '../../Domain/models/Fonte';

export class FonteRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) {
        this.db = db;
    }

    async getFonteById(id: number): Promise<Fonte | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.get(`SELECT * FROM Fonte WHERE id = ?`, [id], (err, row: Fonte) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const fonte = new Fonte(
                            row.id,
                            row.autor,
                            row.referencia
                        );
                        resolve(fonte);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    async getFontes(): Promise<Fonte[] | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.all(`SELECT * FROM Fonte`, (err, rows: Fonte[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const fontes = rows.map((row) => new Fonte(
                            row.id,
                            row.autor,
                            row.referencia
                        ));
                        resolve(fontes);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    async createFonte(fonte: Fonte): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`INSERT INTO Fonte (autor, referencia,vias) VALUES (?,?,?)`,
                    [fonte.autor, fonte.referencia],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
        });
    }

    async updateFonte(fonte: Fonte): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`UPDATE Fonte SET autor = ?, referencia = ? WHERE id = ?`,
                    [fonte.autor, fonte.referencia, fonte.id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
        });
    }

    async deleteFonte(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`DELETE FROM Fonte WHERE id = ?`,
                    [id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    })
            });

        });
    }

}

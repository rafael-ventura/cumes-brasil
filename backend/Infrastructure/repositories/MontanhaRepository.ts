import {Database} from 'sqlite3';
import {Montanha} from '../../Domain/models/Montanha';

export class MontanhaRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Montanha WHERE id = ?`, [id], (err, row: Montanha) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const montanha = new Montanha(
                        row.id,
                        row.nome,
                        row.localizacao,
                        row.altura,
                        row.fonteId
                    );
                    resolve(montanha);
                } else {
                    resolve(null);
                }
            });
        });

    }

    async getMontanhas(): Promise<Montanha[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Montanha`, (err, rows: Montanha[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const montanhas: Montanha[] = [];
                    rows.forEach((row) => {
                        const montanha = new Montanha(
                            row.id,
                            row.nome,
                            row.localizacao,
                            row.altura,
                            row.fonteId
                        );
                        montanhas.push(montanha);
                    });
                    resolve(montanhas);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async createMontanha(montanha: Montanha): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Montanha (nome, localizacao, altura, faces, fonteId) VALUES (?,?,?,?,?)`,
                [montanha.nome, montanha.localizacao, montanha.altura, montanha.fonteId],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

    async updateMontanha(montanha: Montanha): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Montanha SET nome = ?, localizacao = ?, altura = ?, faces = ?, fonteId = ? WHERE id = ?`,
                [montanha.nome, montanha.localizacao, montanha.altura, montanha.fonteId, montanha.id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

    async deleteMontanha(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Montanha WHERE id = ?`,
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }
}
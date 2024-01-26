
import {Database} from 'sqlite3';
import {ColecaoFavoritos} from '../../Domain/models/ColecaoFavoritos';

export class ColecaoFavoritosRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) {
        this.db = db;
    }

    async getColecaoFavoritosById(id: number): Promise<ColecaoFavoritos | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.get(`SELECT * FROM ColecaoFavoritos WHERE id = ?`, [id], (err, row: ColecaoFavoritos) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoFavoritos = new ColecaoFavoritos(
                            row.id,
                            row.nome,
                            row.descricao??"",
                            row.usuario_id!
                        );
                        resolve(colecaoFavoritos);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    async getColecoesFavoritos(): Promise<ColecaoFavoritos[] | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.all(`SELECT * FROM ColecaoFavoritos`, (err, rows: ColecaoFavoritos[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const colecoesFavoritos = rows.map((row) => new ColecaoFavoritos(
                            row.id,
                            row.nome,
                            row.descricao??"",
                            row.usuario_id!
                        ));
                        resolve(colecoesFavoritos);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    async createColecaoFavoritos(colecaoFavoritos: ColecaoFavoritos): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`INSERT INTO ColecaoFavoritos (nome, descricao, usuarioId) VALUES (?,?,?)`,
                    [colecaoFavoritos.nome, colecaoFavoritos.descricao, colecaoFavoritos.usuario_id],
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

    async deleteColecaoFavoritos(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`DELETE FROM ColecaoFavoritos WHERE id = ?`, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    async updateColecaoFavoritos(colecaoFavoritos: ColecaoFavoritos): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`UPDATE ColecaoFavoritos SET nome = ?, descricao = ?, usuarioId = ? WHERE id = ?`,
                    [colecaoFavoritos.nome, colecaoFavoritos.descricao, colecaoFavoritos.usuario_id, colecaoFavoritos.id],
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

}


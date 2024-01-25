import {Database} from 'sqlite3';
import {Face} from '../../Domain/models/Face';

export class FaceRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }


    async getFaceById(id: number): Promise<Face | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Face WHERE id = ?`, [id], (err, row: Face) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const face = new Face(
                        row.id,
                        row.nome,
                        row.montanha_id,
                        row.fonte_id
                    );
                    resolve(face);
                } else {
                    resolve(null);
                }
            });
        });
    }


    async getFaces(): Promise<Face[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Face`, (err, rows: Face[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const faces = rows.map((row) => new Face(
                        row.id,
                        row.nome,
                        row.montanha_id,
                        row.fonte_id
                    ));
                    resolve(faces);
                } else {
                    resolve(null);
                }
            });
        });

    }

    async createFace(face: Face): Promise<void> {
        return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Face (nome, montanha_id, fonte_id) VALUES (?,?,?)`,
                    [face.nome, face.montanha_id, face.fonte_id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            }
                );

    }

    async updateFace(face: Face): Promise<void> {
        return new Promise((resolve, reject) => {
                this.db.run(`UPDATE Face SET nome = ?, montanha_id = ?, fonte_id = ? WHERE id = ?`,
                    [face.nome, face.montanha_id, face.fonte_id, face.id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            }
                );
    }

    async deleteFace(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Face WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

    }

}

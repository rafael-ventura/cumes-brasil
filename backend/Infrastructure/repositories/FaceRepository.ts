import { Database } from 'sqlite3';
import { Face } from '../../Domain/models/Face';

export class FaceRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) {
        this.db = db;
    }

    async getFaceById(id: number): Promise<Face | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.get(`SELECT * FROM Face WHERE id = ?`, [id], (err, row: Face) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const face = new Face(
                            row.id,
                            row.nome,
                            row.montanhaId,

                        );
                        resolve(face);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }
}

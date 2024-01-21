import {Database} from 'sqlite3';
import {Usuario} from '../../Domain/models/Usuario';
import {ColecaoBase} from "../../Domain/models/ColecaoBase";
import {ColecaoFavoritos} from "../../Domain/models/ColecaoFavoritos";
import {ColecaoEscaladas} from "../../Domain/models/ColecaoEscaladas";

export class UsuarioRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) {
        this.db = db;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return new Promise((resolve, reject) => {
            this.db.then(async (db) => {
                try {
                    const usuarioRow = await new Promise<any>((resolve, reject) => {
                        db.get(`SELECT * FROM Usuario WHERE id = ?`, [id], (err, row) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row);
                            }
                        });
                    });

                    if (!usuarioRow) {
                        resolve(null);
                        return;
                    }

                    // Buscar coleções associadas
                    const colecoesPersonalizadasRows = await new Promise<any[]>((resolve, reject) => {
                        db.all(`SELECT * FROM ColecaoBase WHERE usuario_id = ?`, [id], (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                        });
                    });

                    const colecoesFavoritosRows = await new Promise<any[]>((resolve, reject) => {
                        db.all(`SELECT * FROM ColecaoFavoritos WHERE usuario_id = ?`, [id], (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                        });
                    });

                    const colecoesEscaladasRows = await new Promise<any[]>((resolve, reject) => {
                        db.all(`SELECT * FROM ColecaoEscaladas WHERE usuario_id = ?`, [id], (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                        });
                    });

                    // Mapear os resultados para as coleções do usuário
                    const usuario = new Usuario(
                        usuarioRow.id,
                        usuarioRow.nome,
                        usuarioRow.email,
                        usuarioRow.fotoPerfil,
                        colecoesPersonalizadasRows.map(c => new ColecaoBase(c.id, c.nome, c.descricao, c.usuario_id)),
                        colecoesFavoritosRows.map(c => new ColecaoFavoritos(c.id, c.nome, c.descricao, c.usuario_id)),
                        colecoesEscaladasRows.map(c => new ColecaoEscaladas(c.id, c.nome, c.descricao, c.usuario_id, c.viaId, c.data, c.comentario))
                    );

                    resolve(usuario);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }



    async createUsuario(usuario: Usuario): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`INSERT INTO Usuario (nome, email, fotoPerfil) VALUES (?,?,?)`,
                    [usuario.nome, usuario.email, usuario.fotoPerfil],
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

    async updateUsuario(usuario: Usuario): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`UPDATE Usuario SET nome = ?, email = ?, fotoPerfil = ? WHERE id = ?`,
                    [usuario.nome, usuario.email, usuario.fotoPerfil, usuario.id],
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

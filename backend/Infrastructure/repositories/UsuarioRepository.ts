import {Database} from 'sqlite3';
import {Usuario} from '../../Domain/models/Usuario';

export class UsuarioRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarioRow = await new Promise<any>((resolve, reject) => {
                    this.db.get(`SELECT * FROM Usuario WHERE id = ?`, [id], (err, row) => {
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

                const usuario = new Usuario(
                    usuarioRow.id,
                    usuarioRow.nome,
                    usuarioRow.email,
                    usuarioRow.fotoPerfil,
                );

                resolve(usuario);
            } catch (err) {
                reject(err);
            }
        });
    }


    async getUsuarios(): Promise<Usuario[] | null> {
        return new Promise(async (resolve, reject) => {
                try {
                    const usuariosRows = await new Promise<any[]>((resolve, reject) => {
                        this.db.all(`SELECT * FROM Usuario`, (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                        });
                    });

                    const usuarios = await Promise.all(usuariosRows.map(async (usuarioRow) => {
                        return new Usuario(
                            usuarioRow.id,
                            usuarioRow.nome,
                            usuarioRow.email,
                            usuarioRow.fotoPerfil,
                        );
                    }));

                    resolve(usuarios);
                } catch (err) {
                    reject(err);

                }
            }
        );
    }

    async createUsuario(usuario: Usuario): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Usuario (nome, email, fotoPerfil) VALUES (?,?,?)`,
                [usuario.nome, usuario.email, usuario.fotoPerfil],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Usuario SET nome = ?, email = ?, fotoPerfil = ? WHERE id = ?`,
                [usuario.nome, usuario.email, usuario.fotoPerfil, usuario.id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

    async deleteUsuario(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Usuario WHERE id = ?`,
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

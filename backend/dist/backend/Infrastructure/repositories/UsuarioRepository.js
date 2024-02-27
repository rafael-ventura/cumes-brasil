"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const Usuario_1 = require("../../Domain/models/Usuario");
class UsuarioRepository {
    constructor(db) {
        this.db = db;
    }
    async getUsuarioById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuarioRow = await new Promise((resolve, reject) => {
                    this.db.get(`SELECT * FROM Usuario WHERE id = ?`, [id], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                });
                if (!usuarioRow) {
                    resolve(null);
                    return;
                }
                const usuario = new Usuario_1.Usuario(usuarioRow.id, usuarioRow.nome, usuarioRow.email, usuarioRow.fotoPerfil);
                resolve(usuario);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async getUsuarios() {
        return new Promise(async (resolve, reject) => {
            try {
                const usuariosRows = await new Promise((resolve, reject) => {
                    this.db.all(`SELECT * FROM Usuario`, (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
                const usuarios = await Promise.all(usuariosRows.map(async (usuarioRow) => {
                    return new Usuario_1.Usuario(usuarioRow.id, usuarioRow.nome, usuarioRow.email, usuarioRow.fotoPerfil);
                }));
                resolve(usuarios);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async createUsuario(usuario) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Usuario (nome, email, fotoPerfil) VALUES (?,?,?)`, [usuario.nome, usuario.email, usuario.fotoPerfil], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateUsuario(usuario) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Usuario SET nome = ?, email = ?, fotoPerfil = ? WHERE id = ?`, [usuario.nome, usuario.email, usuario.fotoPerfil, usuario.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteUsuario(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Usuario WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.UsuarioRepository = UsuarioRepository;

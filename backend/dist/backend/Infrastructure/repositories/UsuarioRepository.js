"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const Usuario_1 = require("../../Domain/entities/Usuario");
const db_1 = require("../config/db");
class UsuarioRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Usuario_1.Usuario);
    }
    async getById(id) {
        return this.repository.findOne({
            where: {
                id: id,
            }
        });
    }
    async getAll() {
        return this.repository.find();
    }
    async create(nome, email, passwordHash) {
        await this.repository.insert({
            nome: nome,
            email: email,
            password_hash: passwordHash
        });
    }
    async update(id, usuarioData) {
        await this.repository.update(id, usuarioData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    // TODO: Implmentar a função findByEmail sem quebrar a aplicação
    async findByEmail(email) {
        return this.repository.findOne;
    }
    async getPerfil(id) {
        return this.repository.findOne(id);
    }
}
exports.UsuarioRepository = UsuarioRepository;

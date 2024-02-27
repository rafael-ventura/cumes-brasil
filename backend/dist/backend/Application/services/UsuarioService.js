"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
class UsuarioService {
    constructor(repository) {
        this.repository = repository;
    }
    async getUsuarioById(id) {
        return this.repository.getUsuarioById(id);
    }
    async getUsuarios() {
        return this.repository.getUsuarios();
    }
    async createUsuario(usuario) {
        return this.repository.createUsuario(usuario);
    }
    async updateUsuario(usuario) {
        if (!await this.getUsuarioById(usuario.id)) {
            throw new Error("Usuario não encontrada");
        }
        return this.repository.updateUsuario(usuario);
    }
    async deleteUsuario(id) {
        if (!await this.getUsuarioById(id)) {
            throw new Error("Usuario não encontrada");
        }
        return this.repository.deleteUsuario(id);
    }
}
exports.UsuarioService = UsuarioService;

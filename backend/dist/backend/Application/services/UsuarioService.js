"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioService {
    constructor(usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }
    async getUsuarioById(id) {
        return this.usuarioRepo.getById(id);
    }
    async getUsuarios() {
        return this.usuarioRepo.getAll();
    }
    async register(nome, email, password) {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        await this.usuarioRepo.create(nome, email, passwordHash);
    }
    async updateUsuario(usuario) {
        await this.usuarioRepo.update(usuario.id, usuario);
    }
    async deleteUsuario(id) {
        const user = await this.usuarioRepo.getById(id);
        if (!user) {
            throw new Error("Usuario não encontrado");
        }
        await this.usuarioRepo.delete(id);
    }
    async getUsuarioByEmail(email) {
        return this.usuarioRepo.findByEmail(email);
    }
    async getPerfil(id) {
        return this.usuarioRepo.getPerfil(id);
    }
}
exports.UsuarioService = UsuarioService;
exports.default = new UsuarioService(new UsuarioRepository_1.UsuarioRepository());

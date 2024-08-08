"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Colecao_1 = require("../../Domain/entities/Colecao");
const ColecaoRepository_1 = require("../../Infrastructure/repositories/ColecaoRepository");
const typedi_1 = require("typedi");
let UsuarioService = class UsuarioService {
    constructor(usuarioRepo) {
        this.colecaoRepo = typedi_1.Container.get(ColecaoRepository_1.ColecaoRepository);
        this.usuarioRepo = usuarioRepo;
    }
    async getUsuarioById(id) {
        return this.usuarioRepo.getById(id);
    }
    async getUsuarios() {
        return this.usuarioRepo.getAll();
    }
    async register(nome, email, senha) {
        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser != null) {
            throw new Error("Email já cadastrado");
        }
        const senhaHash = await bcrypt_1.default.hash(senha, 10);
        const user = await this.usuarioRepo.create(nome, email, senhaHash);
        await this.createDefaultCollections(user);
    }
    async createDefaultCollections(user) {
        const escaladasCollection = new Colecao_1.Colecao();
        escaladasCollection.nome = 'Escaladas';
        escaladasCollection.descricao = 'Vias que escalei';
        escaladasCollection.usuario = user.id;
        escaladasCollection.imagem = 1;
        await this.colecaoRepo.create(escaladasCollection);
        const favoritasCollection = new Colecao_1.Colecao();
        favoritasCollection.nome = 'Vias Favoritas';
        favoritasCollection.descricao = 'Vias favoritadas por você';
        favoritasCollection.usuario = user.id;
        favoritasCollection.imagem = 1;
        await this.colecaoRepo.create(favoritasCollection);
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
    async getPerfil(id) {
        return this.usuarioRepo.getPerfilSemHash(id);
    }
    async editarDados(id, usuario) {
        await this.usuarioRepo.update(id, usuario);
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UsuarioRepository_1.UsuarioRepository])
], UsuarioService);
exports.default = new UsuarioService(new UsuarioRepository_1.UsuarioRepository());

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const Usuario_1 = require("../../Domain/entities/Usuario");
const db_1 = require("../config/db");
const typedi_1 = require("typedi");
let UsuarioRepository = class UsuarioRepository {
    constructor() {
        this.repository = db_1.AppDataSource.getRepository(Usuario_1.Usuario);
    }
    async getById(id) {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .where("usuario.id = :id", { id })
            .getOne();
    }
    async getAll() {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .getMany();
    }
    async create(nome, email, senhaHash) {
        return this.repository.save({
            nome,
            email,
            password_hash: senhaHash
        });
    }
    async update(id, usuarioData) {
        await this.repository.update(id, usuarioData);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async findByEmail(email) {
        const user = await this.repository.findOne({ where: { email } });
        return user ?? null;
    }
    async getPerfilSemHash(id) {
        return this.repository.createQueryBuilder("usuario")
            .select(['usuario.nome', 'usuario.email', 'usuario.foto_perfil', 'usuario.data_atividade', 'usuario.clube_organizacao', 'usuario.localizacao', 'usuario.biografia', 'usuario.via_preferida'])
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            .leftJoinAndSelect('usuario.foto_perfil', 'foto_perfil')
            .where('usuario.id = :id', { id })
            .getOne();
    }
};
exports.UsuarioRepository = UsuarioRepository;
exports.UsuarioRepository = UsuarioRepository = __decorate([
    (0, typedi_1.Service)()
], UsuarioRepository);

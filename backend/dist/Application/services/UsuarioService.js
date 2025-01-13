"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const ViaRepository_1 = require("../../Infrastructure/repositories/ViaRepository");
const typedi_1 = require("typedi");
const Imagem_1 = require("../../Domain/entities/Imagem");
const ImagemService_1 = require("./ImagemService");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("node:fs"));
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const constants_1 = require("../errors/constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const MailService_1 = require("./MailService");
const UserValidation_1 = __importDefault(require("../validations/UserValidation"));
const ResetUserPasswordTokenService_1 = require("./ResetUserPasswordTokenService");
const TokenValidation_1 = __importDefault(require("../validations/TokenValidation"));
let UsuarioService = class UsuarioService {
    constructor(usuarioRepo, imagemService, viaRepo) {
        this.colecaoRepo = typedi_1.Container.get(ColecaoRepository_1.ColecaoRepository);
        this.mailService = typedi_1.Container.get(MailService_1.MailService);
        this.resetUserPasswordTokenService = typedi_1.Container.get(ResetUserPasswordTokenService_1.ResetUserPasswordTokenService);
        this.usuarioRepo = usuarioRepo;
        this.imagemService = imagemService;
        this.viaRepo = viaRepo;
    }
    async getUsuarioById(id) {
        return this.usuarioRepo.getById(id);
    }
    async getUsuarios() {
        return this.usuarioRepo.getAll();
    }
    async register(nome, email, senha) {
        UserValidation_1.default.registerValidation(nome, email, senha);
        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser != null) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.USER_ALREADY_EXISTS);
        }
        const senhaHash = await bcrypt_1.default.hash(senha, 10);
        const user = await this.usuarioRepo.create(nome, email, senhaHash, 3);
        await this.createDefaultCollections(user);
    }
    async createDefaultCollections(user) {
        const favoritasCollection = new Colecao_1.Colecao();
        favoritasCollection.nome = 'Favoritas';
        favoritasCollection.descricao = 'Vias favoritas do usuário';
        favoritasCollection.usuario = user;
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
    async editarDados(id, usuarioDados, file) {
        const usuario = await this.usuarioRepo.findOne({
            where: { id },
            relations: ['foto_perfil']
        });
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        // Atualiza os dados do usuário
        await this.atualizarDadosUsuario(usuario, usuarioDados);
        // Atualiza a foto de perfil, se enviada
        if (file) {
            await this.atualizarFotoPerfil(usuario, file);
        }
        else if (usuarioDados.removerFoto) {
            // Caso o usuário tenha solicitado a remoção da foto
            await this.removerFotoPerfil(usuario);
        }
    }
    async atualizarDadosUsuario(usuario, usuarioDados) {
        console.log('Usuario dados:', usuarioDados);
        usuario.nome = usuarioDados.nome || usuario.nome;
        usuario.email = usuarioDados.email || usuario.email;
        usuario.data_atividade = usuarioDados.data_atividade || usuario.data_atividade;
        usuario.clube_organizacao = usuarioDados.clube_organizacao || usuario.clube_organizacao;
        usuario.localizacao = usuarioDados.localizacao || usuario.localizacao;
        usuario.biografia = usuarioDados.biografia || usuario.biografia;
        await this.atualizarViaPreferida(usuario, usuarioDados.via_preferida_id);
        await this.usuarioRepo.update(usuario.id, usuario);
    }
    async atualizarViaPreferida(usuario, viaId) {
        if (viaId) {
            const via = await this.viaRepo.getById(viaId);
            if (!via) {
                throw new BadRequestError_1.default('Via preferida não encontrada');
            }
            usuario.via_preferida = via;
        }
    }
    async atualizarFotoPerfil(usuario, file) {
        const imagemAtual = await this.imagemService.getByUsuarioId(usuario.id);
        const novaImagem = new Imagem_1.Imagem();
        novaImagem.url = `/assets/${file.filename}`;
        novaImagem.tipo_entidade = 'usuario';
        novaImagem.descricao = `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`;
        await this.imagemService.create(novaImagem);
        usuario.foto_perfil = novaImagem.id;
        await this.usuarioRepo.update(usuario.id, usuario);
        if (imagemAtual) {
            await this.excluirImagemAntiga(imagemAtual);
        }
    }
    async removerFotoPerfil(usuario) {
        const imagemAtual = await this.imagemService.getByUsuarioId(usuario.id);
        // Define a foto default
        usuario.foto_perfil = 3;
        await this.usuarioRepo.update(usuario.id, usuario);
        // Remove a imagem antiga, se não for a default
        if (imagemAtual) {
            await this.excluirImagemAntiga(imagemAtual);
        }
    }
    async excluirImagemAntiga(imagemAtual) {
        const defaultImageUrl = '/assets/usuario-default-01.jpg';
        if (imagemAtual.url !== defaultImageUrl) {
            const oldImagePath = path_1.default.resolve(__dirname, '..', '..', '..', 'assets', imagemAtual.url.replace('/assets/', ''));
            // Verifica se o caminho da imagem existe antes de tentar deletá-la
            fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error('Imagem não encontrada no sistema de arquivos:', err);
                }
                else {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Erro ao apagar imagem antiga:', unlinkErr);
                        }
                    });
                }
            });
            // Remove a entrada da imagem no banco
            await this.imagemService.delete(imagemAtual.id);
        }
    }
    async createResetUserPassword(email) {
        UserValidation_1.default.generateResetPasswordValidation(email);
        const user = await this.usuarioRepo.findByEmail(email);
        if (!user) {
            throw new NotFoundError_1.default(constants_1.errorsMessage.USER_MAIL_NOT_FOUND);
        }
        let mailSentResponse;
        if (user.resetPasswordToken || user.resetPasswordUrl) {
            try {
                this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);
                mailSentResponse = {
                    message: constants_1.errorsMessage.USER_RESET_PASSWORD_TOKEN_ALREADY_SENT
                };
            }
            catch (error) {
                console.log("catch validacao codigo");
                console.log(error.name, error.message);
                console.log("Criando novo token para usuario com token invalido");
                mailSentResponse = this.generateTokenAndSendEmail(user);
            }
        }
        else {
            console.log("Criando token novo para usuario");
            mailSentResponse = this.generateTokenAndSendEmail(user);
        }
        return mailSentResponse;
    }
    async generateTokenAndSendEmail(user) {
        let newToken = this.resetUserPasswordTokenService.generate(user);
        console.log("newToken", newToken);
        let mailSentResponse = this.mailService.sendResetUserPassword(user.nome, user.email, newToken.smallUrl);
        user.resetPasswordToken = newToken.tokenEncoded;
        user.resetPasswordUrl = newToken.smallUrl;
        this.usuarioRepo.update(user.id, user);
        return mailSentResponse;
    }
    async updateUserPassword(pass, passRepeated, token) {
        UserValidation_1.default.resetPasswordValidation(pass, passRepeated);
        TokenValidation_1.default.resetUserPasswordToken(token);
        const user = await this.usuarioRepo.findByResetPasswordUrl(token);
        if (!user) {
            throw new BadRequestError_1.default(constants_1.errorsMessage.USER_NOT_FOUND);
        }
        this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);
        user.password_hash = await bcrypt_1.default.hash(pass, 10);
        user.resetPasswordToken = '';
        user.resetPasswordUrl = '';
        this.usuarioRepo.resetPassword(user.id, user);
        return { message: constants_1.successMessage.USER_RESET_PASSWORD_UPDATED };
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UsuarioRepository_1.UsuarioRepository, ImagemService_1.ImagemService, ViaRepository_1.ViaRepository])
], UsuarioService);

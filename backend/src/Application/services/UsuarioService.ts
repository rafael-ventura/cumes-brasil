import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import { Colecao } from '../../Domain/entities/Colecao';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { Container, Service } from 'typedi';
import { Imagem } from '../../Domain/entities/Imagem';
import { ImagemService } from './ImagemService';
import path from 'path';
import * as fs from 'node:fs';
import BadRequestError from '../errors/BadRequestError';
import { errorsMessage, successMessage } from '../errors/constants';
import NotFoundError from '../errors/NotFoundError';
import { MailService } from './MailService';
import UserValidation from '../validations/UserValidation';
import { ResetUserPasswordTokenService } from './ResetUserPasswordTokenService';
import TokenValidation from '../validations/TokenValidation';

@Service()
export class UsuarioService {
    private usuarioRepo: UsuarioRepository;
    private colecaoRepo = Container.get(ColecaoRepository);
    private viaRepo: ViaRepository;
    private imagemService: ImagemService;
    private mailService = Container.get(MailService);
    private resetUserPasswordTokenService = Container.get(ResetUserPasswordTokenService);

    constructor(usuarioRepo: UsuarioRepository, imagemService: ImagemService, viaRepo: ViaRepository) {
        this.usuarioRepo = usuarioRepo;
        this.imagemService = imagemService;
        this.viaRepo = viaRepo;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getById(id);
    }

    async getUsuarios(): Promise<Usuario[]> {
        return this.usuarioRepo.getAll();
    }

    async register(nome: string, email: string, senha: string): Promise<void> {
        UserValidation.registerValidation(nome, email, senha);

        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser != null) {
            throw new BadRequestError(errorsMessage.USER_ALREADY_EXISTS);
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        const user = await this.usuarioRepo.create(nome, email, senhaHash, 3);
        await this.createDefaultCollections(user);
    }

    private async createDefaultCollections(user: Usuario): Promise<void> {
        const favoritasCollection = new Colecao();
        favoritasCollection.nome = 'Favoritas';
        favoritasCollection.descricao = 'Vias favoritas do usuário';
        favoritasCollection.usuario = user;
        await this.colecaoRepo.create(favoritasCollection);
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        await this.usuarioRepo.update(usuario.id, usuario);
    }

    async deleteUsuario(id: number): Promise<void> {
        const user = await this.usuarioRepo.getById(id);
        if (!user) {
            throw new Error("Usuario não encontrado");
        }

        await this.usuarioRepo.delete(id);
    }

    async getPerfil(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getPerfilSemHash(id);
    }

    async editarDados(id: number, usuarioDados: Partial<Usuario>, file?: Express.Multer.File): Promise<void> {
        const usuario = await this.usuarioRepo.findOne({
            where: { id },
            relations: ['foto_perfil']
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        await this.atualizarDadosUsuario(usuario, usuarioDados);
        if (file) {
            await this.atualizarFotoPerfil(usuario, file);
        }
    }

    async atualizarDadosUsuario(usuario: Usuario, usuarioDados: Partial<any>) {
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

    async atualizarViaPreferida(usuario: Usuario, viaId: number) {
        if (viaId) {
            const via = await this.viaRepo.getById(viaId);
            if (!via) {
                throw new BadRequestError('Via preferida não encontrada');
            }
            usuario.via_preferida = via;
        }
    }

    private async atualizarFotoPerfil(usuario: Usuario, file: Express.Multer.File) {
        const imagemAtual = await this.imagemService.getByUsuarioId(usuario.id);

        const novaImagem = new Imagem();
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

    private async excluirImagemAntiga(imagemAtual: Imagem) {
        if (imagemAtual.url !== '/assets/usuario-default-01.jpg') {
            const oldImagePath = path.resolve(__dirname, '..', '..', '..', 'assets', imagemAtual.url.replace('/assets/', ''));
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Erro ao apagar imagem antiga:', err);
                }
            });

            await this.imagemService.delete(imagemAtual.id);
        }
    }

    async createResetUserPassword(email: string) {
        UserValidation.generateResetPasswordValidation(email);

        const user = await this.usuarioRepo.findByEmail(email);
        if (!user) {
            throw new NotFoundError(errorsMessage.USER_MAIL_NOT_FOUND);
        }

        let mailSentResponse;
        if (user.resetPasswordToken || user.resetPasswordUrl) {
            try {
                this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);
                mailSentResponse = {
                    message: errorsMessage.USER_RESET_PASSWORD_TOKEN_ALREADY_SENT
                }

            } catch (error: any) {
                mailSentResponse = this.generateTokenAndSendEmail(user);
            }

        } else {
            mailSentResponse = this.generateTokenAndSendEmail(user);
        }

        return mailSentResponse;
    }

    private async generateTokenAndSendEmail(user: Usuario): Promise<any> {
        let newToken = this.resetUserPasswordTokenService.generate(user);
        let mailSentResponse = this.mailService.sendResetUserPassword(user.nome, user.email, newToken.smallUrl);
        user.resetPasswordToken = newToken.tokenEncoded;
        user.resetPasswordUrl = newToken.smallUrl;
        this.usuarioRepo.update(user.id, user);
        return mailSentResponse;
    }

    async updateUserPassword(pass: string, passRepeated: string, token: string) {
        UserValidation.resetPasswordValidation(pass, passRepeated);
        TokenValidation.resetUserPasswordToken(token);

        const user = await this.usuarioRepo.findByResetPasswordUrl(token);
        if (!user) {
            throw new BadRequestError(errorsMessage.USER_NOT_FOUND);
        }

        this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);
        user.password_hash = await bcrypt.hash(pass, 10);
        user.resetPasswordToken = '';
        user.resetPasswordUrl = '';

        this.usuarioRepo.resetPassword(user.id, user);

        return { message: successMessage.USER_RESET_PASSWORD_UPDATED };
    }
}

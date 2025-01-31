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
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import S3Helper from '../../Infrastructure/helpers/S3Helper';

@Service()
export class UsuarioService {
    private usuarioRepo: UsuarioRepository;
    private colecaoRepo = Container.get(ColecaoRepository);
    private viaRepo: ViaRepository;
    private imagemService: ImagemService;
    private imagemRepository: ImagemRepository;
    private mailService = Container.get(MailService);
    private resetUserPasswordTokenService = Container.get(ResetUserPasswordTokenService);
    private s3Service: S3Helper = new S3Helper();

    constructor(usuarioRepo: UsuarioRepository, imagemService: ImagemService, viaRepo: ViaRepository, imagemRepository: ImagemRepository) {
        this.usuarioRepo = usuarioRepo;
        this.imagemService = imagemService;
        this.viaRepo = viaRepo;
        this.imagemRepository = imagemRepository;
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
        let imagem: Imagem | null = await this.imagemRepository.getById(3)
        if (imagem != null) {
            const user = await this.usuarioRepo.create(nome, email, senhaHash, imagem);
            await this.createDefaultCollections(user);
        }
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

    async editarDados(id: number, usuarioDados: any, file?: Express.Multer.File): Promise<void> {
        const usuario = await this.usuarioRepo.findOne({
            where: {id},
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Atualiza os dados do usuário
        await this.atualizarDadosUsuario(usuario, usuarioDados);
    }

    async atualizarDadosUsuario(usuario: Usuario, usuarioDados: Partial<any>) {
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

    async atualizarFotoPerfil(usuarioId: number, file?: Express.Multer.File) {
        if (!file) {
            throw new BadRequestError('Nenhuma imagem foi enviada.');
        }

        const usuario: Usuario | null = await this.usuarioRepo.findOne({ where: { id: usuarioId } });

        if (!usuario) {
            throw new BadRequestError('Usuário não encontrado.');
        }

        // Buscar imagem atual do usuário
        const imagemAtual = await this.imagemService.getByUsuarioId(usuarioId);

        // Remover a imagem antiga do S3, se existir
        if (imagemAtual && process.env.CLOUDFRONT_URL) {
            console.log(`🗑️ Removendo imagem antiga do S3: ${imagemAtual.url}`);
            const fileName = imagemAtual.url.split('/').pop(); // Pega o nome do arquivo
            if (fileName) {
                await this.s3Service.deleteFileS3(fileName);
            }
        }

        let imageUrl: string;

        if (process.env.CLOUDFRONT_URL) {
            // Produção: Enviar para S3
            console.log("🌍 Enviando imagem para o S3...");
            const fileName = `perfil/userId-${usuarioId}-${Date.now()}${path.extname(file.originalname)}`;
            imageUrl = await this.s3Service.uploadFileS3(fileName, file.buffer, file.mimetype);
        } else {
            // Desenvolvimento: Usar caminho local
            console.log("💾 Salvando imagem localmente...");
            imageUrl = `/assets/${file.filename}`;
        }

        console.log("✅ Imagem salva com sucesso:", imageUrl);

        // Atualizar banco de dados com a URL da imagem
        let novaImagem = imagemAtual || new Imagem(); // Se já existia uma, reaproveita
        novaImagem.url = imageUrl;
        novaImagem.tipo_entidade = 'usuario';
        novaImagem.descricao = `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`;

        const novaImagemUpdate = await this.imagemService.update(novaImagem.id, novaImagem);

        if (!novaImagemUpdate) {
            throw new BadRequestError('Erro ao atualizar a imagem');
        }

        usuario.foto_perfil = novaImagemUpdate;
        await this.usuarioRepo.updateFotoPerfil(usuario.id, novaImagemUpdate.id);
    }


    private async removerFotoPerfil(usuario: Usuario) {
        const imagemAtual = await this.imagemService.getByUsuarioId(usuario.id);

        // Define a foto default
        await this.usuarioRepo.update(usuario.id, usuario);

        // Remove a imagem antiga, se não for a default
        if (imagemAtual) {
            await this.excluirImagemAntiga(imagemAtual);
        }
    }

    private async excluirImagemAntiga(imagemAtual: Imagem) {
        const defaultImageUrl = '/assets/usuario-default-01.jpg';

        if (imagemAtual.url !== defaultImageUrl) {
            const oldImagePath = path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'assets',
                imagemAtual.url.replace('/assets/', '')
            );

            // Verifica se o caminho da imagem existe antes de tentar deletá-la
            fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error('Imagem não encontrada no sistema de arquivos:', err);
                } else {
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
        await this.usuarioRepo.update(user.id, user);
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

        await this.usuarioRepo.resetPassword(user.id, user);

        return {message: successMessage.USER_RESET_PASSWORD_UPDATED};
    }
}

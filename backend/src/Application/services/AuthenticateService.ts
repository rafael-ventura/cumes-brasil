import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import { OAuth2Client } from "google-auth-library";
import { ObjectLiteral } from "typeorm";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import {errorsMessage, successMessage} from "../errors/constants";
import UserValidation from "../validations/UserValidation";
import BadRequestError from "../errors/BadRequestError";
import InvalidTokenError from "../errors/InvalidTokenError";
import GoogleAuthenticateService from "./GoogleAuthenticateService";
import {Imagem} from "../../Domain/entities/Imagem";
import {ImagemRepository} from "../../Infrastructure/repositories/ImagemRepository";
import {Usuario} from "../../Domain/entities/Usuario";
import {Colecao} from "../../Domain/entities/Colecao";
import {Container} from "typedi";
import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import TokenValidation from "../validations/TokenValidation";
import {ResetUserPasswordTokenService} from "./ResetUserPasswordTokenService";
import {MailService} from "./MailService";

class AuthService {
    private usuarioRepository: UsuarioRepository;
    private imagemRepository: ImagemRepository;
    private secretKey: string = "";
    private googleService: GoogleAuthenticateService;
    private colecaoRepo = Container.get(ColecaoRepository);
    private resetUserPasswordTokenService = Container.get(ResetUserPasswordTokenService);
    private mailService = Container.get(MailService);

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
        this.imagemRepository = new ImagemRepository();
        this.googleService = new GoogleAuthenticateService();
        this.secretKey = process.env.SECRET_KEY || "";
    }

    async register(nome: string, email: string, senha: string): Promise<any> {
        UserValidation.registerValidation(nome, email, senha);

        const existingUser = await this.usuarioRepository.findByEmail(email);
        if (existingUser != null) {
            throw new BadRequestError(errorsMessage.USER_ALREADY_EXISTS);
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        let imagem: Imagem | null = await this.imagemRepository.getById(3)
        if (imagem != null) {
            let newImagem = new Imagem();
            newImagem.url = imagem.url;
            newImagem.descricao = imagem.descricao;
            newImagem.tipo_entidade = imagem.tipo_entidade;
            newImagem = await this.imagemRepository.create(newImagem);
            const user = await this.usuarioRepository.create(nome, email, senhaHash, newImagem);
            await this.createDefaultCollections(user);
            
            // Retorna token após registro bem-sucedido
            const token = this.generateToken(user.id.toString());
            return { token, usuarioId: user.id, auth: true };
        }
        throw new BadRequestError('Erro ao criar usuário: imagem padrão não encontrada');
    }

    async login(email: string, password: string): Promise<any> {
        UserValidation.authenticateValidation(email, password);

        const user: ObjectLiteral | null | undefined = await this.usuarioRepository.findByEmail(email);
        if (!user) throw new NotFoundError(errorsMessage.USER_MAIL_NOT_FOUND);

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) throw new UnauthorizedError(errorsMessage.BAD_CREDENTIALS);

        const token = this.generateToken(user.id.toString());

        return { "token": token, "usuarioId": user.id, auth: true };
    }

    async googleLogin(authorizationCode: string): Promise<any> {
        if (!authorizationCode) {
            throw new BadRequestError(errorsMessage.GOOGLE_AUTHORIZATION_CODE_INVALID);
        }

        const idToken = await this.googleService.getIdToken(authorizationCode);

        if (!idToken) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR);
        }

        const payload = await this.googleService.getPayloadFromToken(idToken);
        const { sub: usuarioId, email, name, picture } = payload;

        // Ajusta o tamanho da imagem para 400x400 pixels
        let highQualityPicture = picture;
        if (picture) {
            highQualityPicture = picture.replace(/s96-c/, 's400-c');
        }

        if (!usuarioId || !email || !name) {
            throw new InvalidTokenError(errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID);
        }

        let user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
            const passwordHash = await bcrypt.hash(idToken, 10);
            // Use a foto do Google ou a imagem padrão (ID 3)
            if (picture) {
                let newFotoUsuario: Imagem = new Imagem();
                newFotoUsuario.url = highQualityPicture;
                newFotoUsuario.descricao = `foto de perfil do google do usuário ${name} (${usuarioId})`;
                newFotoUsuario.tipo_entidade = "usuario"
                newFotoUsuario = await this.imagemRepository.create(newFotoUsuario);
                user = await this.usuarioRepository.create(name, email, passwordHash, newFotoUsuario);
                await this.createDefaultCollections(user);
            } else {
                const fotoPerfil = await this.imagemRepository.getById(3) // Default image perfil foto
                if (fotoPerfil) {
                    await this.usuarioRepository.create(name, email, passwordHash, fotoPerfil);
                }
            }
            user = await this.usuarioRepository.findByEmail(email);

            if (!user) {
                throw new BadRequestError(errorsMessage.USER_NOT_FOUND);
            }
        }

        const token = this.generateToken(user.id.toString());

        return { token, usuarioId: user.id, auth: true };
    }

    private async createDefaultCollections(user: Usuario): Promise<void> {
        const favoritasCollection = new Colecao();
        favoritasCollection.nome = 'Favoritas';
        favoritasCollection.descricao = 'Vias favoritas do usuário';
        favoritasCollection.usuario = user;
        await this.colecaoRepo.create(favoritasCollection);
    }

    generateToken(usuarioId: string): string {
        return jwt.sign({ usuarioId: usuarioId }, this.secretKey, { expiresIn: '7d' });
    }

    setSecretKey(secretKey: string) {
        this.secretKey = secretKey;
    }

    async createResetUserPassword(email: string) {
        UserValidation.generateResetPasswordValidation(email);

        const user = await this.usuarioRepository.findByEmail(email);
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
        await this.usuarioRepository.update(user.id, user);
        return mailSentResponse;
    }

    async updateUserPassword(pass: string, passRepeated: string, token: string) {
        UserValidation.resetPasswordValidation(pass, passRepeated);
        TokenValidation.resetUserPasswordToken(token);

        const user = await this.usuarioRepository.findByResetPasswordUrl(token);
        if (!user) {
            throw new BadRequestError(errorsMessage.USER_NOT_FOUND);
        }

        this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);
        user.password_hash = await bcrypt.hash(pass, 10);
        user.resetPasswordToken = '';
        user.resetPasswordUrl = '';

        await this.usuarioRepository.resetPassword(user.id, user);

        return {message: successMessage.USER_RESET_PASSWORD_UPDATED};
    }
}

export default AuthService;

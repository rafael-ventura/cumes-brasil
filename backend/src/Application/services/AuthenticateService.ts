import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import { OAuth2Client } from "google-auth-library";
import { ObjectLiteral, QueryRunner } from "typeorm";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { errorsMessage, successMessage } from "../errors/constants";
import UserValidation from "../validations/UserValidation";
import BadRequestError from "../errors/BadRequestError";
import InvalidTokenError from "../errors/InvalidTokenError";
import GoogleAuthenticateService from "./GoogleAuthenticateService";
import { Imagem } from "../../Domain/entities/Imagem";
import { ImagemRepository } from "../../Infrastructure/repositories/ImagemRepository";
import { Usuario } from "../../Domain/entities/Usuario";
import { Colecao } from "../../Domain/entities/Colecao";
import { Service } from "typedi";
import { ColecaoRepository } from "../../Infrastructure/repositories/ColecaoRepository";
import TokenValidation from "../validations/TokenValidation";
import { ResetUserPasswordTokenService } from "./ResetUserPasswordTokenService";
import { MailService } from "./MailService";
import { HashService } from "./HashService";
import { TokenService } from "./TokenService";
import { InternalServerError } from "../errors";
import { AppDataSource } from "../../Infrastructure/config/db";
import { EventBus } from "../../Infrastructure/events/EventBus";
import {
  AUTH_EVENTS,
  IPasswordResetEvent,
} from "../../Domain/interfaces/events/IAuthEvents";

@Service()
class AuthService {
  private usuarioRepository: UsuarioRepository;
  private imagemRepository: ImagemRepository;
  private googleService: GoogleAuthenticateService;
  private colecaoRepo: ColecaoRepository;
  private resetUserPasswordTokenService: ResetUserPasswordTokenService;
  private hashService: HashService;
  private tokenService: TokenService;
  private readonly DEFAULT_AVATAR_ID = 3;
  private eventBus: EventBus;

  constructor(
    usuarioRepository: UsuarioRepository,
    imagemRepository: ImagemRepository,
    googleService: GoogleAuthenticateService,
    colecaoRepo: ColecaoRepository,
    resetUserPasswordTokenService: ResetUserPasswordTokenService,
    hashService: HashService,
    tokenService: TokenService,
    eventBus: EventBus,
  ) {
    this.usuarioRepository = usuarioRepository;
    this.imagemRepository = imagemRepository;
    this.googleService = googleService;
    this.colecaoRepo = colecaoRepo;
    this.resetUserPasswordTokenService = resetUserPasswordTokenService;
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.eventBus = eventBus;
  }

  async register(nome: string, email: string, senha: string): Promise<any> {
    const [_, imagem, senhaHash] = await Promise.all([
      this.validateUserAvailability(email),
      this.getDefaultImage(),
      this.hashService.hash(senha),
    ]);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usuarioRepository.create(
        {
          nome,
          email,
          password_hash: senhaHash,
          foto_perfil: imagem,
        },
        queryRunner,
      );

      await this.colecaoRepo.create(
        {
          nome: "Favoritas",
          descricao: "Vias favoritas do usuário",
          usuario: user,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      const token = this.tokenService.generate(user.id.toString());

      return {
        token,
        usuarioId: user.id,
        auth: true,
      };
    } catch (error) {
      console.error("Error trying to register user", error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async validateUserAvailability(email: string): Promise<void> {
    const existingUser = await this.usuarioRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError(errorsMessage.USER_ALREADY_EXISTS);
    }
  }

  private async getDefaultImage(): Promise<Imagem> {
    const imagem = await this.imagemRepository.getById(this.DEFAULT_AVATAR_ID);
    if (!imagem) {
      throw new InternalServerError("Erro imagem padrão não encontrada");
    }
    return imagem;
  }

  async login(email: string, password: string): Promise<any> {
    const user: Usuario | null =
      await this.usuarioRepository.findByEmail(email);
    if (!user) throw new NotFoundError(errorsMessage.USER_MAIL_NOT_FOUND);

    const isValidPassword = await this.hashService.compare(
      password,
      user.password_hash,
    );
    if (!isValidPassword)
      throw new UnauthorizedError(errorsMessage.BAD_CREDENTIALS);

    const token = this.tokenService.generate(user.id.toString());

    return { token: token, usuarioId: user.id, auth: true };
  }

  async googleLogin(authorizationCode: string): Promise<any> {
    if (!authorizationCode) {
      throw new BadRequestError(
        errorsMessage.GOOGLE_AUTHORIZATION_CODE_INVALID,
      );
    }

    const idToken = await this.googleService.getIdToken(authorizationCode);

    if (!idToken) {
      throw new InvalidTokenError(
        errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_ERROR,
      );
    }

    const payload = await this.googleService.getPayloadFromToken(idToken);
    const { sub: usuarioId, email, name, picture } = payload;

    if (!usuarioId || !email || !name) {
      throw new InvalidTokenError(
        errorsMessage.GOOGLE_AUTHENTICATION_TOKEN_INVALID,
      );
    }

    let user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      const highQualityPicture = picture
        ? picture.replace(/s96-c/, "s400-c")
        : null;
      const passwordHash = await this.hashService.hash(idToken);

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        let fotoPerfil: Imagem;
        if (highQualityPicture) {
          fotoPerfil = await this.imagemRepository.create(
            {
              url: highQualityPicture,
              descricao: `Foto Google: ${name}`,
              tipo_entidade: "usuario",
            },
            queryRunner,
          );
        } else {
          fotoPerfil = await this.getDefaultImage();
        }

        user = await this.usuarioRepository.create(
          {
            nome: name,
            email,
            password_hash: passwordHash,
            foto_perfil: fotoPerfil,
          },
          queryRunner,
        );

        await this.colecaoRepo.create(
          {
            nome: "Favoritas",
            descricao: "Vias favoritas do usuário",
            usuario: user,
          },
          queryRunner,
        );

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Erro ao registrar usuário via Google:", error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    const token = this.tokenService.generate(user.id.toString());
    return {
      token,
      usuarioId: user.id,
      auth: true,
    };
  }

  async createResetUserPassword(email: string) {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(errorsMessage.USER_MAIL_NOT_FOUND);
    }

    if (
      user.resetPasswordToken &&
      this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken)
    ) {
      return { message: errorsMessage.USER_RESET_PASSWORD_TOKEN_ALREADY_SENT };
    }

    const { tokenEncoded, smallUrl } =
      this.resetUserPasswordTokenService.generate(user);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.usuarioRepository.update(
        user.id,
        {
          resetPasswordToken: tokenEncoded,
          resetPasswordUrl: smallUrl,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      const payload: IPasswordResetEvent = {
        nome: user.nome,
        email: user.email,
        url: smallUrl,
      };

      this.eventBus.emit(AUTH_EVENTS.PASSWORD_RESET_REQUESTED, payload);

      return { message: successMessage.USER_RESET_PASSWORD_TOKEN_SENT };
    } catch (error) {
      console.error("Error trying to reset user password", error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserPassword(pass: string, token: string) {
    const user = await this.usuarioRepository.findByResetPasswordUrl(token);
    if (!user) {
      throw new BadRequestError(errorsMessage.USER_NOT_FOUND);
    }

    this.resetUserPasswordTokenService.isTokenValid(user.resetPasswordToken);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newHash = await this.hashService.hash(pass);

      await this.usuarioRepository.update(
        user.id,
        {
          password_hash: newHash,
          resetPasswordToken: "",
          resetPasswordUrl: "",
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return { message: successMessage.USER_RESET_PASSWORD_UPDATED };
    } catch (error) {
      console.error("Error trying to reset user password", error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export default AuthService;

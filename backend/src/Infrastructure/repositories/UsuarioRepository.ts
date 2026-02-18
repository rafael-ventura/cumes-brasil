import { Usuario } from "../../Domain/entities/Usuario";
import { AppDataSource } from "../config/db";
import { Service } from "typedi";
import { Imagem } from "../../Domain/entities/Imagem";
import BaseRepository from "./BaseRepository";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";
import { LoadStrategy } from "../../Domain/enum/ELoadStrategy";
import { UsuarioRelationConfig } from "./config/UsuarioRelationConfig";
import { QueryRunner, SelectQueryBuilder } from "typeorm";
import { QueryBuilderHelper } from "../helpers/QueryBuilderHelper";
import { RepositoryOptions } from "./config/RepositoryOptions";

@Service()
export class UsuarioRepository
  extends BaseRepository<Usuario>
  implements ICrudRepository<Usuario>
{
  protected entityTarget = Usuario;

  constructor() {
    super(Usuario);
  }

  /**
   * Aplica relações ao Query Builder baseado em RepositoryOptions.
   */
  private applyRelationsFromOptions(
    queryBuilder: SelectQueryBuilder<Usuario>,
    options?: RepositoryOptions<Usuario>,
  ): SelectQueryBuilder<Usuario> {
    if (options?.relations && options.relations.length > 0) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`usuario.${relation}`, relation);
      });
      return queryBuilder;
    }

    const strategy = options?.strategy ?? LoadStrategy.DETAIL;
    return QueryBuilderHelper.applyRelations(
      queryBuilder,
      "usuario",
      strategy,
      UsuarioRelationConfig,
    );
  }

  async getById(
    id: number,
    options?: RepositoryOptions<Usuario>,
  ): Promise<Usuario | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("usuario")
      .where("usuario.id = :id", { id });
    return this.applyRelationsFromOptions(queryBuilder, options).getOne();
  }

  async getAll(options?: RepositoryOptions<Usuario>): Promise<Usuario[]> {
    const effectiveOptions = options || { strategy: LoadStrategy.LIST };
    const queryBuilder = this.repository.createQueryBuilder("usuario");
    return this.applyRelationsFromOptions(
      queryBuilder,
      effectiveOptions,
    ).getMany();
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  async getPerfilSemHash(id: number): Promise<Usuario | null> {
    const queryBuilder = this.repository
      .createQueryBuilder("usuario")
      .select([
        "usuario.nome",
        "usuario.email",
        "usuario.foto_perfil",
        "usuario.data_atividade",
        "usuario.clube_organizacao",
        "usuario.localizacao",
        "usuario.biografia",
        "usuario.via_preferida",
      ])
      .where("usuario.id = :id", { id });

    return this.applyRelationsFromOptions(queryBuilder, {
      strategy: LoadStrategy.DETAIL,
    }).getOne();
  }

  async findOne(param: { where: { id: number }; relations?: string[] }) {
    return this.repository.findOne(param);
  }

  async findByResetPasswordUrl(token: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { resetPasswordUrl: token } });
  }

  async updateFotoPerfil(
    usuarioId: number,
    fotoPerfilId: number,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Usuario)
      .set({ foto_perfil: { id: fotoPerfilId } })
      .where("id = :usuarioId", { usuarioId })
      .execute();
  }
}

import { AppDataSource } from "../config/db";
import { EntityTarget, Repository, ObjectLiteral, QueryRunner } from "typeorm";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";
import { RepositoryOptions } from "./config/RepositoryOptions";

export type PaginationResult<T> = {
  items: T[];
  total: number;
  totalPages: number;
};

/**
 * BaseRepository refatorado com API options-based.
 * Subclasses devem sobrescrever métodos para suportar LoadStrategy via QueryBuilderHelper.
 */
export default abstract class BaseRepository<
  T extends ObjectLiteral,
> implements ICrudRepository<T> {
  protected abstract entityTarget: EntityTarget<T>;
  protected repository: Repository<T>;

  protected constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository<T>(entity);
  }

  /**
   * Retorna a quantidade de regitros na tabela T
   * @returns number
   */
  async countAll() {
    return await this.repository.count();
  }

  /**
   * Busca entidade por ID
   * @param id - ID da entidade
   * @param options - Opções de carregamento (strategy, relations, etc)
   *
   * @example
   * ```typescript
   * // Sem relações (MINIMAL)
   * const entity = await repo.getById(123);
   *
   * // Com estratégia (usa QueryBuilderHelper se subclasse implementar)
   * const entity = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
   *
   * // Com relações customizadas
   * const entity = await repo.getById(123, { relations: ['montanha', 'face'] });
   * ```
   */
  async getById(id: number, options?: RepositoryOptions<T>): Promise<T | null> {
    if (options?.relations) {
      return this.repository.findOne({
        where: { id } as any,
        relations: options.relations,
      });
    }

    if (options?.strategy) {
      throw new Error(
        `${this.constructor.name} must override getById() to support LoadStrategy. ` +
          `Use options.relations for manual control or implement strategy support.`,
      );
    }

    return await this.repository.findOne({ where: { id } as any });
  }

  /**
   * Busca todas as entidades.
   *
   * @param options - Opções de carregamento
   *
   * @example
   * ```typescript
   * // Todas as entidades sem relações
   * const all = await repo.getAll();
   *
   * // Com estratégia (subclasse implementa)
   * const all = await repo.getAll({ strategy: LoadStrategy.LIST });
   * ```
   */
  async getAll(options?: RepositoryOptions<T>): Promise<T[]> {
    if (options?.relations) {
      return this.repository.find({ relations: options.relations });
    }

    if (options?.strategy) {
      throw new Error(
        `${this.constructor.name} must override getAll() to support LoadStrategy.`,
      );
    }

    return await this.repository.find();
  }

  /**
   * Busca paginada de entidades.
   *
   * @param page - Número da página (1-indexed)
   * @param limit - Itens por página
   * @param options - Opções de carregamento
   *
   * @example
   * ```typescript
   * // Paginação simples
   * const result = await repo.getAllPaginated(1, 20);
   *
   * // Com estratégia
   * const result = await repo.getAllPaginated(1, 20, { strategy: LoadStrategy.LIST });
   * ```
   */
  async getAllPaginated(
    page: number,
    limit: number,
    options?: RepositoryOptions<T>,
  ): Promise<PaginationResult<T>> {
    if (options?.relations) {
      const [items, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: options.relations,
      });

      return {
        items,
        total,
        totalPages: Math.ceil(total / limit),
      };
    }

    if (options?.strategy) {
      throw new Error(
        `${this.constructor.name} must override getAllPaginated() to support LoadStrategy.`,
      );
    }

    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: Partial<T>, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      return (await queryRunner.manager.save(this.entityTarget, data)) as unknown as T;
    }
    return await this.repository.save(data as T);
  }

  async update(
    id: number,
    data: Partial<T>,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.update(
        this.entityTarget,
        id as number,
        data as Partial<T>,
      );
      return;
    }
    await this.repository.update(id as number, data as T);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id as number);
  }
}

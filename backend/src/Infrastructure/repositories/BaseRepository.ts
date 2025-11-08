import { AppDataSource } from "../config/db";
import { EntityTarget, FindManyOptions, Repository, ObjectLiteral } from "typeorm";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";

export type PaginationResult<T> = {
    items: T[];
    total: number;
    totalPages: number;
};

export default abstract class BaseRepository<T extends ObjectLiteral> implements ICrudRepository<T> {
    protected repository: Repository<T>;

    protected constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository<T>(entity);
    }

    async getById(id: number, relations?: string[]): Promise<T | null> {
        return this.repository.findOne({ where: { id } as any, relations });
    }

    async getAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async getAllPaginated(page: number, limit: number, options?: FindManyOptions<T>): Promise<PaginationResult<T>> {
        const [items, total] = await this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            ...(options ?? {})
        });

        return {
            items,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.save(data as any);
    }

    async update(id: number, data: Partial<T>): Promise<void> {
        await this.repository.update(id as any, data as any);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id as any);
    }
}



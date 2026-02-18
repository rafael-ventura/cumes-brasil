import { QueryRunner } from 'typeorm';
import { RepositoryOptions } from '../../../Infrastructure/repositories/config/RepositoryOptions';

export interface ICrudRepository<T> {
    getById(id: number, options?: RepositoryOptions<T>): Promise<T | null>;    
    getAll(options?: RepositoryOptions<T>): Promise<T[]>;
    create(data: Partial<T>, queryRunner?: QueryRunner): Promise<T>;
    update(id: number, data: Partial<T>, queryRunner?: QueryRunner): Promise<void>;
    delete(id: number): Promise<void>;
}



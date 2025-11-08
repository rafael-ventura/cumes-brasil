export interface ICrudRepository<T> {
    getById(id: number): Promise<T | null>;
    getAll(...args: any[]): Promise<any>;
    create(data: Partial<T>): Promise<any>;
    update(id: number, data: Partial<T>): Promise<any>;
    delete(id: number): Promise<any>;
}



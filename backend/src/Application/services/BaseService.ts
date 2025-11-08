import NotFoundError from "../errors/NotFoundError";

export default abstract class BaseService<T, R> {
    protected repository: R;

    protected constructor(repository: R) {
        this.repository = repository;
    }

    protected ensureExists(entity: T | null | undefined, notFoundMessage: string): T {
        if (!entity) {
            throw new NotFoundError(notFoundMessage);
        }
        return entity;
    }
}



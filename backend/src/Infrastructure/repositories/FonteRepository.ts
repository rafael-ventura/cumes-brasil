import { Service } from 'typedi';
import { Fonte } from "../../Domain/entities/Fonte";
import BaseRepository from "./BaseRepository";

/**
 * Repository para entidade Fonte.
 * @example
 * ```typescript
 * // Criar fonte
 * const fonte = await fonteRepo.create({
 *   nome: 'Guia de Escaladas do Rio de Janeiro',
 *   autor: 'João Silva',
 *   ano: 2023
 * });
 * 
 * // Buscar por ID
 * const fonte = await fonteRepo.getById(123);
 * 
 * // Listar todas
 * const fontes = await fonteRepo.getAll();
 * ```
 */
@Service()
export class FonteRepository extends BaseRepository<Fonte> {
    protected entityTarget = Fonte;

    constructor() {
        super(Fonte);
    }

    // Todos os métodos CRUD herdados de BaseRepository:
    // - getById(id, options?)
    // - getAll(options?)
    // - getAllPaginated(page, limit, options?)
    // - create(data)
    // - update(id, data)
    // - delete(id)
}

/* INIT -------------------- new via Repo  ---------------------------*/
import { DocumentStore, IDocumentSession } from 'ravendb';
import { IVia } from '../../Domain/models/Via';

export class ViaRepository {
    private session: IDocumentSession;

    constructor(store: DocumentStore) {
        this.session = store.openSession();
    }

    async getById(id: string): Promise<IVia | null> {
        return await this.session.load<IVia>(id);
    }

    async getAll(): Promise<IVia[]> {
        return await this.session.query<IVia>({ collection: 'vias' }).all();
    }

    /* TODO: Validar os dois metodos findDetaildById abaixo... */
    /*findDetailedById(id: number): Promise<IVia | null> {
        const query =
            `
            SELECT * 
            FROM vias 
            LEFT JOIN outra_tabela ON vias.some_id = outra_tabela.some_id
            WHERE vias.id = ?
        `;
        const [rows] = pool.query<IVia[]>(query, [id]);
        return rows[0] as IVia || null;
    }*/

    async findDetailedById(id: string): Promise<IVia | null> {
        const route = await this.session
            .query<IVia>({ collection: 'vias' })
            .include('algumaPropriedade.Relacionada') // Substitua 'algumaPropriedade.Relacionada' pelo nome da propriedade que você deseja incluir
            .whereEquals('id', id)
            .firstOrNull();
        return route || null;
    }
}

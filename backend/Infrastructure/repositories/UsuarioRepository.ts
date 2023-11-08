import {DocumentStore} from 'ravendb';
import {UsuarioDTO} from '../../../shared/contratos/UsuarioDto';

// Ajuste o caminho de importação conforme necessário

export class UsuarioRepository {
    private store: DocumentStore;

    constructor(store: DocumentStore) {
        this.store = store;
    }

    async createUsuario(usuario: UsuarioDTO): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.store(usuario);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async getUsuario(id: number): Promise<UsuarioDTO | null> {
        const session = this.store.openSession();
        try {
            return await session.load(id.toString());
        } finally {
            await session.dispose();
        }
    }

    async updateUsuario(usuario: UsuarioDTO): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.store(usuario);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async deleteUsuario(id: number): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.delete(id.toString());
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }
}

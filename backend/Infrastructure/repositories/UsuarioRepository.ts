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

    async getUsuario(id: string): Promise<UsuarioDTO | null> {
        const session = this.store.openSession();
        try {
            return await session.load(id);
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

    async deleteUsuario(id: string): Promise<void> {
        const session = this.store.openSession();
        try {
            const usuario = await session.load(id);
            if (usuario) {
                await session.delete(usuario);
                await session.saveChanges();
            }
        } finally {
            await session.dispose();
        }
    }
}

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

    async updateUsuario(usuario: UsuarioDTO): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.store(usuario);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async deleteUsuario(id_usuario: number): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.delete(id_usuario);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async getUsuarioById(id_usuario: number): Promise<UsuarioDTO> {
        const session = this.store.openSession();
        try {
            return await session.load(id_usuario);
        } finally {
            await session.dispose();
        }
    }

    async getColecaoEscaladas(): Promise<UsuarioDTO[]> {
        const session = this.store.openSession();
        try {
            return await session.query({collection: 'ColecaoEscaladas'}).all();
        } finally {
            await session.dispose();
        }
    }

    async getColecaoFavoritos(): Promise<UsuarioDTO[]> {
        const session = this.store.openSession();
        try {
            return await session.query({collection: 'ColecaoFavoritos'}).all();
        } finally {
            await session.dispose();
        }
    }

}

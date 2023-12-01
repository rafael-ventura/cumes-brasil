import {DocumentStore} from 'ravendb';
import {Usuario} from "../../Domain/models/Usuario";
import {UsuarioAdapter} from "../adapters/UsuarioAdapter";
import {UsuarioDTO} from "../../../shared/contratos/UsuarioDto";

// Ajuste o caminho de importação conforme necessário

export class UsuarioRepository {
    private store: DocumentStore;
    private adapter: UsuarioAdapter;

    constructor(store: DocumentStore) {
        this.store = store;
        this.adapter = new UsuarioAdapter();
    }

    public async createUser(usuario: Usuario): Promise<Usuario> {
        const session = this.store.openSession();
        try {
            await session.store(usuario);
            await session.saveChanges();
            return usuario;
        } finally {
            session.dispose();
        }
    }

    public async getUsuarioById(id_usuario: number): Promise<Usuario> {
        const session = this.store.openSession();
        try {
            const documents = await session.query({collection: 'Usuarios'}).whereEquals('Id', id_usuario).all();
            if (documents.length === 0) {
                throw new Error('Usuário não encontrado');
            }
            // Assegura que o objeto é do tipo Usuario antes de passar para o adaptador
            return documents[0] as Usuario;
        } finally {
            session.dispose();
        }
    }

    public async login(email: string, senha: string): Promise<Usuario> {

        const session = this.store.openSession();
        const usuario = await session.query<Usuario>({collection: 'Usuarios'})
            .whereEquals('email', email)
            .whereEquals('senha', senha)
            .firstOrNull();
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    public async logout(usuarioId: number): Promise<void> {
        const session = this.store.openSession();
        try {
            const usuario = await session.load<Usuario>(usuarioId.toString());
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
        } finally {
            session.dispose();
        }
    }

    public async alterarSenha(usuarioId: number, novaSenha: string): Promise<void> {
        const session = this.store.openSession();
        try {
            const usuario = await session.load<Usuario>(usuarioId.toString());
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            usuario.setSenha(novaSenha);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    public async iniciarRecuperacaoSenha(email: string): Promise<void> {
        const session = this.store.openSession();
        try {
            const usuario = await session.query<Usuario>({collection: 'Usuarios'})
                .whereEquals('email', email)
                .firstOrNull();
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            // Implementar lógica de início de recuperação de senha
        } finally {
            session.dispose();
        }
    }

    public async redefinirSenha(token: string, novaSenha: string): Promise<void> {
        const session = this.store.openSession();
        try {
            const usuario = await session.query<Usuario>({collection: 'Usuarios'})
                .whereEquals('token', token)
                .firstOrNull();
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            usuario.setSenha(novaSenha);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    public async atualizarPerfil(usuarioId: number, dadosAtualizados: UsuarioDTO): Promise<Usuario> {
        const session = this.store.openSession();
        try {
            const usuario = await session.load<Usuario>(usuarioId.toString());
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            usuario.nome = dadosAtualizados.nome;
            usuario.email = dadosAtualizados.email;
            usuario.fotoPerfil = dadosAtualizados.fotoPerfil;
            await session.saveChanges();
            return usuario;
        } finally {
            session.dispose();
        }

    }

    public async getUsuarioByEmail(email: string): Promise<boolean> {
        const session = this.store.openSession();
        try {
            const usuario = await session.query<Usuario>({collection: 'Usuarios'})
                .whereEquals('email', email)
                .firstOrNull();
            return !!usuario;
        } finally {
            session.dispose();
        }
    }

}

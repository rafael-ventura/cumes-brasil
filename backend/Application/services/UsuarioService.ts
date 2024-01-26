import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import {Usuario} from "../../Domain/models/Usuario";


export class UsuarioService {
    private repository: UsuarioRepository;

    constructor(repository: UsuarioRepository) {
        this.repository = repository;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return this.repository.getUsuarioById(id);
    }

    async getUsuarios(): Promise<Usuario[] | null> {
        return this.repository.getUsuarios();
    }

    async createUsuario(usuario: Usuario): Promise<void> {
        return this.repository.createUsuario(usuario);
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        return this.repository.updateUsuario(usuario);
    }

    async deleteUsuario(id: number): Promise<void> {
        return this.repository.deleteUsuario(id);
    }
    async getColecaoBaseById(id: number) {
        return this.repository.deleteUsuario(id);
    }
}
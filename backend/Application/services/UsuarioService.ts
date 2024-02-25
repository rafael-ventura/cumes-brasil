import {Usuario} from "../../Domain/models/Usuario";
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";


export class UsuarioService {
    private repository: UsuarioRepository;

    constructor(repository: UsuarioRepository) {
        this.repository = repository;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return this.repository.getById(id);
    }

    async getUsuarios(): Promise<Usuario[] | null> {
        return this.repository.getAll();
    }

    async createUsuario(usuario: Usuario): Promise<void> {
        return this.repository.create(usuario);
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        if (!await this.getUsuarioById(usuario.id)) {
            throw new Error("Usuario não encontrada");
        }
        return this.repository.update(usuario);
    }

    async deleteUsuario(id: number): Promise<void> {
        if (!await this.getUsuarioById(id)) {
            throw new Error("Usuario não encontrada");
        }
        return this.repository.delete(id);
    }
}
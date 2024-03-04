import {Usuario} from "../../Domain/models/Usuario";
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import bcrypt from "bcrypt";


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

    async register(nome: string, email: string, password: string): Promise<void> {
        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) throw new Error('Email already registered');

        const passwordHash = await bcrypt.hash(password, 10);
        await this.repository.create(nome, email, passwordHash);
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
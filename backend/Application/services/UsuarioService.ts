import { Usuario } from "../../Domain/entities/Usuario";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import bcrypt from "bcrypt";

export class UsuarioService {
    private usuarioRepo: UsuarioRepository;

    constructor (usuarioRepo: UsuarioRepository) {
        this.usuarioRepo = usuarioRepo;
    }

    async getUsuarioById (id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getById(id);
    }

    async getUsuarios (): Promise<Usuario[]> {
        return this.usuarioRepo.getAll();
    }

    async register (nome: string, email: string, senha: string): Promise<void> {
        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser != null) {
            throw new Error("Email já cadastrado");
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        await this.usuarioRepo.create(nome, email, senhaHash);
    }

    async updateUsuario (usuario: Usuario): Promise<void> {
        await this.usuarioRepo.update(usuario.id, usuario);
    }

    async deleteUsuario (id: number): Promise<void> {
        const user = await this.usuarioRepo.getById(id);
        if (!user) {
            throw new Error("Usuario não encontrado");
        }

        await this.usuarioRepo.delete(id);
    }

    async getUsuarioByEmail (email: string): Promise<any> {
        return this.usuarioRepo.findByEmail(email);

    }

    async getPerfil (id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getPerfil(id);
    }
}

export default new UsuarioService(new UsuarioRepository());

import { Usuario } from "../../Domain/entities/Usuario";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import bcrypt from "bcrypt";
import {Colecao} from "../../Domain/entities/Colecao";
import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import {Container, Service} from "typedi";

@Service()
export class UsuarioService {
    private usuarioRepo: UsuarioRepository;
    private colecaoRepo = Container.get(ColecaoRepository);

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
        const user = await this.usuarioRepo.create(nome, email, senhaHash);
        // depois de criar o usuario, cria a coleção padrão
        this.createDefaultCollection(user);
    }

    private createDefaultCollection(user: Usuario): void {
        const collection = new Colecao();
        collection.nome = "Escaladas";
        collection.descricao = "Vias que escalei";
        collection.usuario = user.id;
        collection.imagem = 1;
        this.colecaoRepo.create(collection);
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
        return this.usuarioRepo.getPerfilSemHash(id);
    }
}

export default new UsuarioService(new UsuarioRepository());

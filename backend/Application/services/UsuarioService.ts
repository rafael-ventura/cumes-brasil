import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import { Colecao } from '../../Domain/entities/Colecao';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Container, Service } from 'typedi';

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
        await this.createDefaultCollections(user);
    }

    private async createDefaultCollections (user: Usuario): Promise<void> {
        const escaladasCollection = new Colecao();
        escaladasCollection.nome = 'Escaladas';
        escaladasCollection.descricao = 'Vias que escalei';
        escaladasCollection.usuario = user.id;
        escaladasCollection.imagem = 1;
        await this.colecaoRepo.create(escaladasCollection);

        const favoritasCollection = new Colecao();
        favoritasCollection.nome = 'Vias Favoritas';
        favoritasCollection.descricao = 'Vias favoritadas por você';
        favoritasCollection.usuario = user.id;
        favoritasCollection.imagem = 1;
        await this.colecaoRepo.create(favoritasCollection);
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

    async getPerfil (id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getPerfilSemHash(id);
    }

    async editarDados (id: number, usuario: Usuario): Promise<void> {
        await this.usuarioRepo.update(id, usuario);
    }
}

export default new UsuarioService(new UsuarioRepository());

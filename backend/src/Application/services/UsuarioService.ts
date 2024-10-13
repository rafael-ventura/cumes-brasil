import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import { Colecao } from '../../Domain/entities/Colecao';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Container, Service } from 'typedi';
import { Imagem } from '../../Domain/entities/Imagem';
import { ImagemService } from './ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';

@Service()
export class UsuarioService {
    private usuarioRepo: UsuarioRepository;
    private colecaoRepo = Container.get(ColecaoRepository);
    private imagemService: ImagemService;

    constructor (usuarioRepo: UsuarioRepository, imagemService: ImagemService) {
        this.usuarioRepo = usuarioRepo;
        this.imagemService = imagemService;
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
        const user = await this.usuarioRepo.create(nome, email, senhaHash, 3);
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

    async editarDados (id: number,
      usuarioDados: Partial<Usuario>,
      file?: Express.Multer.File
    ): Promise<void> {
        const usuario = await this.usuarioRepo.findOne({
            where: { id },
            relations: ['foto_perfil']
        });
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        usuario.nome = usuarioDados.nome || usuario.nome;
        usuario.email = usuarioDados.email || usuario.email;
        usuario.data_atividade = usuarioDados.data_atividade || usuario.data_atividade;
        usuario.clube_organizacao = usuarioDados.clube_organizacao || usuario.clube_organizacao;
        usuario.localizacao = usuarioDados.localizacao || usuario.localizacao;
        usuario.biografia = usuarioDados.biografia || usuario.biografia;

        if (usuarioDados.via_preferida) {
            usuario.via_preferida = usuarioDados.via_preferida;
        }

        if (file) {
            try {
                const imagem = new Imagem();
                imagem.url = `/assets/${file.filename}`;
                imagem.tipo_entidade = 'usuario';
                imagem.descricao = 'Foto de perfil do usuário ' + usuario.nome + ' (' + usuario.id + ')';
                await this.imagemService.createImagem(imagem);
                usuario.foto_perfil = imagem.id;
            } catch (error) {
                console.error('Erro ao salvar a imagem:', error);
                throw error;
            }
        }

        await this.usuarioRepo.update(id, usuario);
    }
}

export default new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()));

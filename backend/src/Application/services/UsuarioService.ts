import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import { Colecao } from '../../Domain/entities/Colecao';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Container, Service } from 'typedi';
import { Imagem } from '../../Domain/entities/Imagem';
import { ImagemService } from './ImagemService';
import path from 'path';
import * as fs from 'node:fs';
import RegistrarUsuarioValidation from '../validations/RegistrarUsuarioValidation';
import BadRequestError from '../errors/BadRequestError';
import { errorsMessage } from '../errors/constants';

@Service()
export class UsuarioService {
    private usuarioRepo: UsuarioRepository;
    private colecaoRepo = Container.get(ColecaoRepository);
    private imagemService: ImagemService;

    constructor(usuarioRepo: UsuarioRepository, imagemService: ImagemService) {
        this.usuarioRepo = usuarioRepo;
        this.imagemService = imagemService;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getById(id);
    }

    async getUsuarios(): Promise<Usuario[]> {
        return this.usuarioRepo.getAll();
    }

    async register(nome: string, email: string, senha: string): Promise<void> {
        RegistrarUsuarioValidation.validaUsuario(nome, email, senha);

        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser != null) {
            throw new BadRequestError(errorsMessage.USER_ALREADY_EXISTS);
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        const user = await this.usuarioRepo.create(nome, email, senhaHash, 3);
        await this.createDefaultCollections(user);
    }

    private async createDefaultCollections(user: Usuario): Promise<void> {
        const favoritasCollection = new Colecao('Vias Favoritas', 'Vias favoritadas por você', user.id, 1);
        await this.colecaoRepo.create(favoritasCollection);
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        await this.usuarioRepo.update(usuario.id, usuario);
    }

    async deleteUsuario(id: number): Promise<void> {
        const user = await this.usuarioRepo.getById(id);
        if (!user) {
            throw new Error("Usuario não encontrado");
        }

        await this.usuarioRepo.delete(id);
    }

    async getPerfil(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.getPerfilSemHash(id);
    }

    async editarDados(id: number, usuarioDados: Partial<Usuario>, file?: Express.Multer.File): Promise<void> {
        const usuario = await this.usuarioRepo.findOne({
            where: { id },
            relations: ['foto_perfil']
        });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        this.atualizarDadosUsuario(usuario, usuarioDados);
        if (file) {
            await this.atualizarFotoPerfil(usuario, file);
        }
    }

    private atualizarDadosUsuario(usuario: Usuario, usuarioDados: Partial<Usuario>) {
        usuario.nome = usuarioDados.nome || usuario.nome;
        usuario.email = usuarioDados.email || usuario.email;
        usuario.data_atividade = usuarioDados.data_atividade || usuario.data_atividade;
        usuario.clube_organizacao = usuarioDados.clube_organizacao || usuario.clube_organizacao;
        usuario.localizacao = usuarioDados.localizacao || usuario.localizacao;
        usuario.biografia = usuarioDados.biografia || usuario.biografia;
        if (usuarioDados.via_preferida) {
            usuario.via_preferida = usuarioDados.via_preferida;
        }
    }

    private async atualizarFotoPerfil(usuario: Usuario, file: Express.Multer.File) {
        const imagemAtual = await this.imagemService.getByUsuarioId(usuario.id);

        const novaImagem = new Imagem();
        novaImagem.url = `/assets/${file.filename}`;
        novaImagem.tipo_entidade = 'usuario';
        novaImagem.descricao = `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`;
        await this.imagemService.create(novaImagem);
        usuario.foto_perfil = novaImagem.id;

        await this.usuarioRepo.update(usuario.id, usuario);
        if (imagemAtual) {
            await this.excluirImagemAntiga(imagemAtual);
        }
    }

    private async excluirImagemAntiga(imagemAtual: Imagem) {
        if (imagemAtual.url !== '/assets/usuario-default-01.jpg') {
            const oldImagePath = path.resolve(__dirname, '..', '..', '..', 'assets', imagemAtual.url.replace('/assets/', ''));
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Erro ao apagar imagem antiga:', err);
                }
            });

            await this.imagemService.delete(imagemAtual.id);
        }
    }
}

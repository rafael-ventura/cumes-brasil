import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Service } from 'typedi';
import { ImagemService } from './ImagemService';
import path from 'path';
import BadRequestError from '../errors/BadRequestError';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import S3Helper from '../../Infrastructure/helpers/S3Helper';
import NotFoundError from '../errors/NotFoundError';
import BaseService from './BaseService';
import UserValidation from '../validations/UserValidation';

@Service()
export class UsuarioService extends BaseService<Usuario, UsuarioRepository> {
    private viaRepo: ViaRepository;
    private imagemService: ImagemService;
    private imagemRepository: ImagemRepository;
    private s3Service: S3Helper = new S3Helper();
    private escaladaRepo?: EscaladaRepository;
    private colecaoRepo?: ColecaoRepository;

    constructor(
        usuarioRepo: UsuarioRepository,
        imagemService: ImagemService,
        viaRepo: ViaRepository,
        imagemRepository: ImagemRepository,
        escaladaRepo?: EscaladaRepository,
        colecaoRepo?: ColecaoRepository
    ) {
        super(usuarioRepo);
        this.imagemService = imagemService;
        this.viaRepo = viaRepo;
        this.imagemRepository = imagemRepository;
        this.escaladaRepo = escaladaRepo;
        this.colecaoRepo = colecaoRepo;
    }

    async getUsuarioById(id: number): Promise<Usuario | null> {
        return this.repository.getById(id);
    }

    async getUsuarios(): Promise<Usuario[]> {
        return this.repository.getAll();
    }

    async updateUsuario(usuario: Usuario): Promise<void> {
        await this.repository.update(usuario.id, usuario);
    }

    async deleteUsuario(id: number): Promise<void> {
        const user = await this.repository.getById(id);
        if (!user) {
            throw new NotFoundError("Usuario não encontrado");
        }

        await this.repository.delete(id);
    }

    async getPerfil(id: number): Promise<Usuario | null> {
        return this.repository.getPerfilSemHash(id);
    }

    async getPerfilPorUsername(username: string): Promise<{ usuario: Usuario; numEscaladas: number; numColecoes: number; numFavoritas: number } | null> {
        const usuario = await this.repository.getPerfilPublicoPorUsername(username);
        if (!usuario) return null;

        let numEscaladas = 0;
        let numColecoes = 0;
        let numFavoritas = 0;

        if (this.escaladaRepo) {
            const uname = usuario.username?.trim();
            if (uname) {
                numEscaladas = await this.escaladaRepo.getCountOndeUsuarioParticipaPublico(usuario.id, uname);
            }
        }
        if (this.colecaoRepo) {
            const colecoes = await this.colecaoRepo.getByUsuarioId(usuario.id);
            numColecoes = colecoes.length;
            const favoritas = colecoes.find(c => c.nome === 'Favoritas');
            numFavoritas = favoritas ? (favoritas.viaColecoes?.length ?? 0) : 0;
        }

        return { usuario, numEscaladas, numColecoes, numFavoritas };
    }

    async editarDados(id: number, usuarioDados: any, file?: Express.Multer.File): Promise<void> {
        const usuario = await this.repository.findOne({
            where: { id },
        });

        if (!usuario) {
            throw new NotFoundError('Usuário não encontrado');
        }

        // Atualiza os dados do usuário
        await this.atualizarDadosUsuario(usuario, usuarioDados);
    }

    async atualizarDadosUsuario(usuario: Usuario, usuarioDados: Partial<any>) {
        usuario.nome = usuarioDados.nome || usuario.nome;
        usuario.email = usuarioDados.email || usuario.email;
        usuario.data_atividade = usuarioDados.data_atividade || usuario.data_atividade;
        usuario.clube_organizacao = usuarioDados.clube_organizacao || usuario.clube_organizacao;
        usuario.localizacao = usuarioDados.localizacao || usuario.localizacao;
        usuario.biografia = usuarioDados.biografia || usuario.biografia;
        if (usuarioDados.link_externo !== undefined) {
            const linkTrimmed = String(usuarioDados.link_externo).trim();
            usuario.link_externo = linkTrimmed ? linkTrimmed : undefined;
        }

        if (usuarioDados.conquistas_publico !== undefined) {
            usuario.conquistas_publico = usuarioDados.conquistas_publico === true || usuarioDados.conquistas_publico === 'true';
        }

        if (usuarioDados.perfil_publico !== undefined) {
            usuario.perfil_publico = usuarioDados.perfil_publico === true || usuarioDados.perfil_publico === 'true';
        }

        if (usuarioDados.username !== undefined) {
            const usernameTrimmed = String(usuarioDados.username).trim().toLowerCase();
            if (usernameTrimmed && usernameTrimmed !== usuario.username) {
                const emUso = await this.repository.usernameExiste(usernameTrimmed, usuario.id);
                if (emUso) {
                    throw new BadRequestError('Username já está em uso');
                }
                UserValidation.usernameValidation(usernameTrimmed);
                usuario.username = usernameTrimmed;
            }
        }

        await this.atualizarViaPreferida(usuario, usuarioDados.via_preferida_id);
        await this.repository.update(usuario.id, usuario);
    }

    async atualizarViaPreferida(usuario: Usuario, viaId: number) {
        if (viaId) {
            const via = await this.viaRepo.getById(viaId);
            if (!via) {
                throw new BadRequestError('Via preferida não encontrada');
            }
            usuario.via_preferida = via;
        }
    }

    async atualizarFotoPerfil(usuarioId: number, file?: Express.Multer.File) {
        if (!file) {
            throw new BadRequestError('Nenhuma imagem foi enviada.');
        }

        const usuario: Usuario | null = await this.repository.findOne({ where: { id: usuarioId } });

        if (!usuario) {
            throw new BadRequestError('Usuário não encontrado.');
        }

        // Buscar imagem atual do usuário
        let imagemAtual = await this.imagemService.getByUsuarioId(usuarioId);

        // Remover a imagem antiga do S3, se existir e não for a padrão (ID 3)
        if (imagemAtual && imagemAtual.id !== 3 && process.env.CLOUDFRONT_URL) {
            const fileName = imagemAtual.url.split('/').pop();
            if (fileName) {
                await this.s3Service.deleteFileS3(fileName);
            }
        }

        let imageUrl: string;

        if (process.env.CLOUDFRONT_URL) {
            // Produção: Enviar para S3
            const fileName = `perfil/userId-${usuarioId}-${Date.now()}${path.extname(file.originalname)}`;
            imageUrl = await this.s3Service.uploadFileS3(fileName, file.buffer, file.mimetype);
        } else {
            // Desenvolvimento: Usar caminho local (Multer salva em assets/usuarios/)
            imageUrl = `/assets/usuarios/${file.filename}`;
        }

        let novaImagemUpdate;
        if (imagemAtual != null) {
            if (imagemAtual.id === 3) {
                const novaImagemData = {
                    url: imageUrl,
                    tipo_entidade: 'usuario',
                    descricao: `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`
                };

                novaImagemUpdate = await this.imagemRepository.createNew(novaImagemData);
            } else {
                // Atualizar a imagem existente do usuário
                imagemAtual.url = imageUrl;
                imagemAtual.descricao = `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`;
                novaImagemUpdate = await this.imagemService.update(imagemAtual.id, imagemAtual);
            }
        } else {
            // Se não tem imagem atual, criar nova
            const novaImagemData = {
                url: imageUrl,
                tipo_entidade: 'usuario',
                descricao: `Foto de perfil do usuário ${usuario.nome} (${usuario.id})`
            };

            novaImagemUpdate = await this.imagemRepository.createNew(novaImagemData);
        }


        if (!novaImagemUpdate) {
            throw new BadRequestError('Erro ao atualizar a imagem');
        }

        usuario.foto_perfil = novaImagemUpdate;
        await this.repository.updateFotoPerfil(usuario.id, novaImagemUpdate.id);
    }

    async excluirFotoPerfil(usuarioId: number) {
        const usuario: Usuario | null = await this.repository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new BadRequestError('Usuário não encontrado.');
        }
        // Buscar imagem atual do usuário = 15
        const imagemAtual = await this.imagemService.getByUsuarioId(usuarioId);
        // Remover a imagem antiga do S3 ou do sistema de arquivos, se existir e não for a default
        if (imagemAtual && imagemAtual.id !== 3) {
            if (process.env.CLOUDFRONT_URL) {
                const fileName = imagemAtual.url.split('/').pop();
                if (fileName) {
                    await this.s3Service.deleteFileS3(fileName);
                }
            }
            // Excluir a imagem antiga do banco
            let imagemDefault = await this.imagemService.getById(3);
            if (imagemDefault != null) {
                usuario.foto_perfil = imagemDefault;
                await this.repository.updateFotoPerfil(usuario.id, imagemDefault.id);
                await this.imagemService.delete(imagemAtual.id);
            }
        }
    }
}

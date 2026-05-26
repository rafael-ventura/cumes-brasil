import { Usuario } from '../../Domain/entities/Usuario';
import { AppDataSource } from '../config/db';
import { Service } from 'typedi';
import {Imagem} from "../../Domain/entities/Imagem";
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';

@Service()
export class UsuarioRepository extends BaseRepository<Usuario> implements ICrudRepository<Usuario> {
    constructor() {
        super(Usuario);
    }

    async getById(id: number, relations?: string[]): Promise<Usuario | null> {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            // Localização através de Setor
            .leftJoinAndSelect('via_preferida.setor', 'setor')
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
            .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
            .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
            .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
            .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
            .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
            .leftJoinAndSelect('setor.face', 'setorFace')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            // Localização através de Face
            .leftJoinAndSelect('via_preferida.face', 'face')
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
            .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
            .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
            .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
            .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
            .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Localização através de Montanha
            .leftJoinAndSelect('via_preferida.montanha', 'montanha')
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
            .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
            .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
            .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
            .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
            .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .where("usuario.id = :id", { id })
            .getOne();
    }

    async getAll(): Promise<Usuario[]> {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .getMany();
    }

    async createUsuario(nome: string, email: string, senhaHash: string, imagem: Imagem, username?: string): Promise<Usuario> {
        const dados: Partial<Usuario> = {
            nome,
            email,
            password_hash: senhaHash,
            foto_perfil: imagem,
            perfil_publico: true
        };
        if (username) {
            dados.username = username;
        }
        return this.repository.save(dados);
    }

    async update(id: number, usuarioData: Partial<Usuario>): Promise<void> {
        await this.repository.update(id, usuarioData);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        const user = await this.repository.findOne({ where: { email } });
        return user ?? null;
    }

    async findByUsername(username: string): Promise<Usuario | null> {
        const user = await this.repository.findOne({ where: { username } });
        return user ?? null;
    }

    async usernameExiste(username: string, excluirId?: number): Promise<boolean> {
        const qb = this.repository.createQueryBuilder('usuario')
            .where('usuario.username = :username', { username });
        if (excluirId) {
            qb.andWhere('usuario.id != :excluirId', { excluirId });
        }
        const count = await qb.getCount();
        return count > 0;
    }

    async gerarUsernameDisponivel(baseNome: string): Promise<string> {
        const base = baseNome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 30) || 'usuario';
        let username = base;
        let sufixo = 1;
        while (await this.usernameExiste(username)) {
            username = `${base}_${sufixo}`;
            sufixo++;
        }
        return username;
    }

    async getPerfilPublicoPorUsername(username: string): Promise<Usuario | null> {
        return this.repository.createQueryBuilder("usuario")
            .select(['usuario.id', 'usuario.nome', 'usuario.username', 'usuario.foto_perfil', 'usuario.data_atividade', 'usuario.clube_organizacao', 'usuario.localizacao', 'usuario.biografia', 'usuario.via_preferida', 'usuario.link_externo', 'usuario.conquistas_publico'])
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            .leftJoinAndSelect('via_preferida.setor', 'setor')
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
            .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
            .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
            .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
            .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
            .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
            .leftJoinAndSelect('setor.face', 'setorFace')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            .leftJoinAndSelect('via_preferida.face', 'face')
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
            .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
            .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
            .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
            .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
            .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            .leftJoinAndSelect('via_preferida.montanha', 'montanha')
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
            .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
            .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
            .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
            .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
            .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
            .leftJoinAndSelect('usuario.foto_perfil', 'foto_perfil')
            .addSelect(['usuario.perfil_publico'])
            .where('usuario.username = :username', { username })
            .getOne();
    }

    async getPerfilSemHash(id: number): Promise<Usuario | null> {
        return this.repository.createQueryBuilder("usuario")
            .select(['usuario.id', 'usuario.nome', 'usuario.username', 'usuario.email', 'usuario.foto_perfil', 'usuario.data_atividade', 'usuario.clube_organizacao', 'usuario.localizacao', 'usuario.biografia', 'usuario.perfil_publico', 'usuario.via_preferida', 'usuario.link_externo', 'usuario.conquistas_publico'])
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            // Localização através de Setor
            .leftJoinAndSelect('via_preferida.setor', 'setor')
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
            .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
            .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
            .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
            .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
            .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
            .leftJoinAndSelect('setor.face', 'setorFace')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            // Localização através de Face
            .leftJoinAndSelect('via_preferida.face', 'face')
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
            .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
            .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
            .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
            .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
            .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Localização através de Montanha
            .leftJoinAndSelect('via_preferida.montanha', 'montanha')
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
            .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
            .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
            .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
            .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
            .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
            .leftJoinAndSelect('usuario.foto_perfil', 'foto_perfil')
            .where('usuario.id = :id', { id })
            .getOne();
    }

    async findOne(param: { where: { id: number }; relations?: string[] }) {
        return this.repository.findOne(param);
    }

    async findByResetPasswordUrl(token: string): Promise<Usuario | null> {
        return this.repository.findOne({ where: { resetPasswordUrl: token } });
    }

    async resetPassword(usuarioId: number, userUpdated: Usuario) {
        await this.repository.update(usuarioId, userUpdated);
    }

    async updateFotoPerfil(usuarioId: number, fotoPerfilId: number): Promise<void> {
        await this.repository.createQueryBuilder()
            .update(Usuario)
            .set({ foto_perfil: { id: fotoPerfilId } })
            .where("id = :usuarioId", { usuarioId })
            .execute();
    }
}

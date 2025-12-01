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

    async createUsuario(nome: string, email: string, senhaHash: string, imagem: Imagem): Promise<Usuario> {
        return this.repository.save({
            nome,
            email,
            password_hash: senhaHash,
            foto_perfil: imagem
        });
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

    async getPerfilSemHash(id: number): Promise<Usuario | null> {
        return this.repository.createQueryBuilder("usuario")
            .select(['usuario.nome', 'usuario.email', 'usuario.foto_perfil', 'usuario.data_atividade', 'usuario.clube_organizacao', 'usuario.localizacao', 'usuario.biografia', 'usuario.via_preferida'])
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

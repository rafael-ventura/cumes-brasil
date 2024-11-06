import { Usuario } from '../../Domain/entities/Usuario';
import { AppDataSource } from '../config/db';
import { Service } from 'typedi';

@Service()
export class UsuarioRepository {
    private repository = AppDataSource.getRepository(Usuario);

    async getById(id: number): Promise<Usuario | null> {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect('usuario.via_preferida', 'via_preferida')
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .where("usuario.id = :id", { id })
            .getOne();
    }

    async getAll(): Promise<Usuario[]> {
        return this.repository.createQueryBuilder("usuario")
            .leftJoinAndSelect("usuario.foto_perfil", "foto_perfil")
            .getMany();
    }

    async create(nome: string, email: string, senhaHash: string, imagemId: number): Promise<Usuario> {
        return this.repository.save({
            nome,
            email,
            password_hash: senhaHash,
            foto_perfil: imagemId
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
            .leftJoinAndSelect('usuario.foto_perfil', 'foto_perfil')
            .where('usuario.id = :id', { id })
            .getOne();
    }

    async findOne(param: { where: { id: number }; relations: string[] }) {
        return this.repository.findOne(param);
    }

    async findByResetPasswordUrl(token: string): Promise<Usuario | null> {
        return this.repository.findOne({ where: { resetPasswordUrl: token } });
    }

    async resetPassword(userId: number, userUpdated: Usuario) {
        await this.repository.update(userId, userUpdated);
    }
}

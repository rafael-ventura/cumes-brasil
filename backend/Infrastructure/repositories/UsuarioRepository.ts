import { Usuario } from "../../Domain/entities/Usuario";
import { AppDataSource } from "../config/db";
import { ObjectLiteral } from "typeorm";

export class UsuarioRepository {
    private repository = AppDataSource.getRepository(Usuario);

    async getById (id: number): Promise<Usuario | null> {
        return this.repository.findOne({
            where: {
                id: id,
            }
        });
    }

    async getAll () {
        return this.repository.find();
    }

    async create (nome: string, email: string, senhaHash: string): Promise<void> {
        await this.repository.insert({
            nome: nome,
            email: email,
            password_hash: senhaHash
        });
    }

    async update (id: number, usuarioData: Partial<Usuario>): Promise<void> {
        await this.repository.update(id as any, usuarioData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }

    async findByEmail (email: string): Promise<ObjectLiteral | null> {
        const user = await this.repository.findOne({ where: { email } });
        return user ?? null;
    }

    async getPerfil (id: number): Promise<Usuario | null> {
        return this.repository.findOne(id as any);
    }
}


import { Usuario } from "../../Domain/entities/Usuario";
import { AppDataSource } from "../config/db";

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

    async create (nome: string, email: string, passwordHash: string): Promise<void> {
        await this.repository.insert({
            nome: nome,
            email: email,
            password_hash: passwordHash
        });
    }

    async update (id: number, usuarioData: Partial<Usuario>): Promise<void> {
        await this.repository.update(id as any, usuarioData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }

    // TODO: Implmentar a função findByEmail sem quebrar a aplicação
    async findByEmail (email: string) {
        return this.repository.findOne;
    }

    async getPerfil (id: number): Promise<Usuario | null> {
        return this.repository.findOne(id as any);
    }
}


import { Usuario } from "../../Domain/entities/Usuario";
import { AppDataSource } from "../config/db.ts";

export class UsuarioRepository {
    private repository = AppDataSource.getRepository(Usuario);

    async getById (id: number): Promise<Usuario | null> {
        return this.repository.findOne(id as any);
    }

    async getAll () {
        return this.repository.find();
    }

    async create (nome: string, email: string, passwordHash: string): Promise<void> {
        await this.repository.insert({
            nome,
            email,
            passwordHash
        });
    }

    async update (usuario: Usuario): Promise<void> {
        await this.repository.update(usuario.id as any, usuario);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }

    async findByEmail (email: string) {
        return this.repository.findOne(email as any);
    }

    async getPerfil (id: number): Promise<Usuario | null> {
        return this.repository.findOne(id as any);
    }
}


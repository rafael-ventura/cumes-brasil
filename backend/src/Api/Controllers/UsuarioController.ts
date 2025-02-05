import { UsuarioService } from '../../Application/services/UsuarioService';
import { Request, Response } from 'express';
import { Usuario } from '../../Domain/entities/Usuario';

export class UsuarioController {
    private service: UsuarioService;

    constructor(service: UsuarioService) {
        this.service = service;
    }

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const resultado = await this.service.getUsuarioById(id);
            if (!resultado) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    getAll = async (_: Request, res: Response) => {
        try {
            const result = await this.service.getUsuarios();
            if (result.length === 0) {
                return res.status(404).json({ message: 'Nenhum Usuario encontrado' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const usuario: Usuario = req.body;
            await this.service.updateUsuario(usuario);
            res.status(200).json({ message: 'Usuario atualizado com sucesso.' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    editarFotoPerfil = async (req: Request, res: Response) => {
        try {
            const usuarioId = req.user.usuarioId;
            const file = req.file;
            console.log("📸 Arquivo recebido:", req.file);
            await this.service.atualizarFotoPerfil(usuarioId, file);

            res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuário não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteUsuario(id);
            res.status(200).json({ message: 'Usuario deletado com sucesso.' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario não encontrado') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    getPerfil = async (req: Request, res: Response) => {
        try {
            const usuarioId = parseInt(req.user.usuarioId);
            const resultado = await this.service.getPerfil(usuarioId);
            if (!resultado) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    editarDados = async (req: Request, res: Response) => {
        try {
            const usuarioId = parseInt(req.user.usuarioId);
            const usuarioDados: any = req.body;
            await this.service.editarDados(usuarioId, usuarioDados);

            res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Perfil não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };
}

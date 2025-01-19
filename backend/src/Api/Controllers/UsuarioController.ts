import { UsuarioService } from '../../Application/services/UsuarioService';
import { NextFunction, Request, Response } from 'express';
import { Usuario } from '../../Domain/entities/Usuario';
import HandleErrors from '../../Application/errors/HandleErrors';

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

    registrar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                nome,
                email,
                senha
            } = req.body;
            await this.service.register(nome, email, senha);
            res.status(201).json({ message: 'Usuario criado com sucesso.' });
        } catch (error) {
            HandleErrors.handleErrors(error, req, res, next);
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

            if (!req.file && Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Nenhum dado enviado para atualização.' });
            }

            const file = req.file;
            await this.service.editarDados(usuarioId, usuarioDados, file);

            res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Perfil não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido' });
        }
    };

    generateResetUserPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.createResetUserPassword(req.body?.email);
            res.status(200).json({
                message: response.message
            });

        } catch (error: any) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }

    /**
     * Criar lógica para resetar senha do usuario
     */
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.updateUserPassword(req.body?.password, req.body?.passwordRepeated, req.params?.token);
            res.status(201).json({
                message: response.message
            });
        } catch (error: any) {
            HandleErrors.handleErrors(error, req, res, next);
        }
    }
}

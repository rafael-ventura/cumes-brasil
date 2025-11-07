import {UsuarioService} from '../../Application/services/UsuarioService';
import {Request, Response} from 'express';
import {Usuario} from '../../Domain/entities/Usuario';
import {UsuarioDTO} from "../DTOs/Usuario/UsuarioDTO";
import { NotFoundError } from '../../Application/errors';
import UsuarioValidation from '../../Application/validations/UsuarioValidation';

export class UsuarioController {
    private service: UsuarioService;

    constructor(service: UsuarioService) {
        this.service = service;
    }

    getById = async (req: Request, res: Response) => {
        const id = UsuarioValidation.idParam(req.params.id);
        const usuario = await this.service.getUsuarioById(id);
        if (!usuario) {
            throw new NotFoundError("Usuário não encontrado.");
        }
        return res.json(new UsuarioDTO(usuario));
    };

    getAll = async (_: Request, res: Response) => {
        const usuarios = await this.service.getUsuarios();
        if (!usuarios || usuarios.length === 0) {
            throw new NotFoundError("Nenhum usuário encontrado");
        }
        return res.json(usuarios.map(u => new UsuarioDTO(u)));
    };

    update = async (req: Request, res: Response) => {
        const usuario: Usuario = req.body;
        UsuarioValidation.updateBody(usuario);
        await this.service.updateUsuario(usuario);
        res.status(200).json({message: 'Usuario atualizado com sucesso.'});
    };

    editarFotoPerfil = async (req: Request, res: Response) => {
        const usuarioId = req.user.usuarioId;
        const file = req.file;
        UsuarioValidation.editarFoto(file);
        await this.service.atualizarFotoPerfil(usuarioId, file);

        res.status(200).json({message: 'Usuário atualizado com sucesso.'});
    };

    delete = async (req: Request, res: Response) => {
        const id = UsuarioValidation.idParam(req.params.id);
        await this.service.deleteUsuario(id);
        res.status(200).json({message: 'Usuario deletado com sucesso.'});
    };

    getPerfil = async (req: Request, res: Response) => {
        const usuarioId = parseInt(req.user.usuarioId);
        const resultado = await this.service.getPerfil(usuarioId);
        if (!resultado) {
            throw new NotFoundError('Perfil não encontrado.');
        }
        res.json(resultado);
    };

    editarDados = async (req: Request, res: Response) => {
        const usuarioId = parseInt(req.user.usuarioId);
        const usuarioDados: any = req.body;
        UsuarioValidation.editarDados(usuarioDados);
        await this.service.editarDados(usuarioId, usuarioDados);

        res.status(200).json({message: 'Perfil atualizado com sucesso.'});
    };
}

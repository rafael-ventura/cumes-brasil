import { Request, Response } from "express";
import { UsuarioService } from "../../Application/services/UsuarioService";
import { UsuarioDTO } from "../../../shared/contratos/UsuarioDto";
import session from 'express-session';

export class UsuarioController {
    private service: UsuarioService;

    constructor(service: UsuarioService) {
        this.service = service;
    }

    createUser = async (req: Request, res: Response) => {
        const usuarioData = req.body;
        const novoUsuario = await this.service.createUser(usuarioData);
        res.json(novoUsuario);
    };

    getUsuarioById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const usuario = await this.service.getUsuarioById(id);
        res.json(usuario);
    };

    login = async (req: Request, res: Response) => {
        const { email, senha } = req.body;
        const usuario = await this.service.login(email, senha);
        if (usuario) {
            req.session.userId = usuario.id;
            res.json(usuario);
        } else {
            res.status(401).send("Credenciais inválidas");
        }
    };

    logout = async (req: Request, res: Response) => {
        const usuarioId = req.session.userId;
        await this.service.logout(usuarioId);
        req.session.destroy((err) => {
            if (err) {
                return res.send('Erro ao fazer logout');
            }
            res.send("Logout realizado com sucesso");
        });
    };

    alterarSenha = async (req: Request, res: Response) => {
        const usuarioId = parseInt(req.params.id);
        const { novaSenha } = req.body;
        await this.service.alterarSenha(usuarioId, novaSenha);
        res.send("Senha alterada com sucesso");
    };

    iniciarRecuperacaoSenha = async (req: Request, res: Response) => {
        const { email } = req.body;
        await this.service.iniciarRecuperacaoSenha(email);
        res.send("Processo de recuperação de senha iniciado");
    };

    redefinirSenha = async (req: Request, res: Response) => {
        const { token, novaSenha } = req.body;
        await this.service.redefinirSenha(token, novaSenha);
        res.send("Senha redefinida com sucesso");
    };

    atualizarPerfil = async (req: Request, res: Response) => {
        const usuarioId = parseInt(req.params.id);
        const dadosAtualizados = req.body as UsuarioDTO;
        const usuarioAtualizado = await this.service.atualizarPerfil(usuarioId, dadosAtualizados);
        res.json(usuarioAtualizado);
    };

    verificarEmail = async (req: Request, res: Response) => {
        const { email } = req.body;
        const existe = await this.service.verificarEmail(email);
        res.json({ emailExiste: existe });
    };
}

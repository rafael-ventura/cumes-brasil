import {UsuarioService} from "../../Application/services/UsuarioService";
import {Request, Response} from "express";
import {Usuario} from "../../Domain/models/Usuario";

export class UsuarioController {
    private service: UsuarioService;

    constructor(service: UsuarioService) {
        this.service = service;
    }

    getUsuarioById = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            const resultado = await this.service.getUsuarioById(id);
            if (!resultado) {
                return resposta.status(404).json({message: "Usuario não encontrada."});
            }
            resposta.json(resultado);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    getAllUsuario = async (_: Request, resposta: Response) => {
        try {
            const result = await this.service.getUsuarios();
            resposta.json(result);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    createUsuario = async (requisicao: Request, resposta: Response) => {
        try {
            const usuario: Usuario = requisicao.body;
            await this.service.createUsuario(usuario);
            resposta.status(201).json({message: "Usuario criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }
    };

    updateUsuario = async (requisicao: Request, resposta: Response) => {
        try {
            const usuario: Usuario = requisicao.body;
            await this.service.updateUsuario(usuario);
            resposta.json({message: "Usuario atualizada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }
    };

    deleteUsuario = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            await this.service.deleteUsuario(id);
            resposta.json({message: "Usuario deletada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }

    }
}
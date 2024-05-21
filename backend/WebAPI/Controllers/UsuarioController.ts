import { UsuarioService } from "../../Application/services/UsuarioService";
import { Request, Response } from "express";
import { Usuario } from "../../Domain/entities/Usuario";

export class UsuarioController {
    private service: UsuarioService;

    constructor (service: UsuarioService) {
        this.service = service;
    }

    /**
     * @route GET /usuarios/:id
     * @group Usuarios - Operações relacionadas a Usuarios
     * @returns {Usuario.model} 200 - Usuario encontrada
     * @returns {object} 404 - Usuario não encontrado
     * @returns {Error} 500 - Ocorreu um erro desconhecido
     */
    getById = async (requisicao: Request, resposta: Response) => {
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

    /**
     * @route GET /usuarios
     * @group Usuarios - Operações relacionadas a Usuarios
     * @returns {Array.<Usuario>} 200 - Usuarios encontradas
     * @returns {object} 404 - Usuarios não encontrados
     * @returns {Error} 500 - Ocorreu um erro desconhecido
     */
    getAll = async (_: Request, resposta: Response) => {
        try {
            const result = await this.service.getUsuarios();
            if (result?.length === 0) {
                return resposta.status(404).json({message: "Nenhum usuario encontrado"});
            }
            resposta.json(result);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    /**
     * @route POST /usuarios
     * @group Usuarios - Operações relacionadas a Usuarios
     * @returns {object} 200 - Usuario criada com sucesso.
     * @returns {Error} 500 - Ocorreu um erro desconhecido
     */
    registrar = async (requisicao: Request, resposta: Response) => {
        try {
            const { nome, email, senha } = requisicao.body;
            await this.service.register(nome, email, senha);
            resposta.status(201).json({message: "Usuario criado com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }
    };

    /**
     * @route PUT /usuarios
     * @group Usuarios - Operações relacionadas a Usuarios
     * @returns {object} 200 - Usuario atualizada com sucesso
     * @returns {object} 404 -message error
     * @returns {Error} 500 - Ocorreu um erro desconhecido
     */
    update = async (requisicao: Request, resposta: Response) => {
        try {
            const usuario: Usuario = requisicao.body;
            await this.service.updateUsuario(usuario);
            resposta.status(200).json({message: "Usuario atualizada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario não encontrada") {
                    return resposta.status(404).json({message: error.message});
                }
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }
    };

    /**
     * @route DELETE /usuarios/:id
     * @group Usuarios - Operações relacionadas a Usuarios
     * @returns {Usuario.model} 200 - Usuario deletada com sucesso
     * @returns {object} 404 -message error
     * @returns {Error} 500 - Ocorreu um erro desconhecido
     */
    delete = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            await this.service.deleteUsuario(id);
            resposta.status(200).json({message: "Usuario deletada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario não encontrada") {
                    return resposta.status(400).json({error: error.message});
                }
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    //get perfil
    getPerfil = async (requisicao: Request, resposta: Response) => {
    try {
        const userId = parseInt(requisicao.params.id);
        const resultado = await this.service.getPerfil(userId);
        if (!resultado) {
            return resposta.status(404).json({message: "Perfil não encontrado."});
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
}

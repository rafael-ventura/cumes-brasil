import {Request, Response} from "express";
import {ViaService} from "../../Application/services/ViaService";
import {Via} from "../../Domain/models/Via";

export class ViaController {
    private service: ViaService;

    constructor(service: ViaService) {
        this.service = service;
    }

    /**
     * @route GET /vias/:id
     * @group Vias - Operações relacionadas a vias
     * @returns {Via.model} 200 - Via encontrada
     * @returns {object} 404 - Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getViaById = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            const resultado = await this.service.getViaById(id);
            if (!resultado) {
                return resposta.status(404).json({message: "Via não encontrada."});
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
     * @route GET /vias
     * @group Vias - Operações relacionadas a vias
     * @returns {Array.<Via>} 200 - Vias encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllVia = async (_: Request, resposta: Response) => {
        try {
            const vias: Via[] | null = await this.service.getVias();
            if (vias?.length === 0) {
                return resposta.status(404).json({message: "Via não encontrada."});
            }
            resposta.json(vias);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    /**
     * @route POST /vias
     * @group Vias - Operações relacionadas a vias
     * @returns {object} 201 - Via criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createVia = async (requisicao: Request, resposta: Response) => {
        try {
            const via: Via = requisicao.body;
            await this.service.createVia(via);
            resposta.status(201).json({message: "Via criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }

        }
    };

    /**
     * @route PUT /vias
     * @group Vias - Operações relacionadas a vias
     * @returns {object} 200 - Via atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateVia = async (requisicao: Request, resposta: Response) => {
        try {
            const via: Via = requisicao.body;
            await this.service.updateVia(via);
            resposta.json({message: "Via atualizada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Via não encontrada.") {
                    return resposta.status(404).json({message: error.message});
                }
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    /**
     * @route DELETE /vias/:id
     * @group Vias - Operações relacionadas a vias
     * @returns {object} 200 - Via deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Via não encontrada
     */
    deleteVia = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            await this.service.deleteVia(id);
            resposta.json({message: "Via deletada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Via não encontrada.") {
                    return resposta.status(404).json({message: error.message});
                }
                resposta.status(500).json({error: error.message});
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };
}

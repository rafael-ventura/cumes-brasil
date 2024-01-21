import { Request, Response } from "express";
import { ViaService } from "../../Application/services/ViaService";
import {Via} from "../../Domain/models/Via";

export class ViaController {
    private service: ViaService;

    constructor(service: ViaService) {
        this.service = service;
    }

    getViaById = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            const resultado = await this.service.getViaById(id);
            if (!resultado) {
                return resposta.status(404).json({ message: "Via não encontrada." });
            }
            resposta.json(resultado);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({ error: error.message });
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    getAllVia = async (_: Request, resposta: Response) => {
        try {
            const result = await this.service.getVias();
            resposta.json(result);
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({ error: error.message });
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };

    createVia = async (requisicao: Request, resposta: Response) => {
        try {
            const via: Via = requisicao.body;
            await this.service.createVia(via);
            resposta.status(201).json({ message: "Via criada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({ error: error.message });
            } else {
                resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
            }

        }
    };

    updateVia = async (requisicao: Request, resposta: Response) => {
        try {
            const via: Via = requisicao.body;
            await this.service.updateVia(via);
            resposta.json({ message: "Via atualizada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({ error: error.message });
            } else {
                resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
            }
        }
    };

    deleteVia = async (requisicao: Request, resposta: Response) => {
        try {
            const id = parseInt(requisicao.params.id);
            await this.service.deleteVia(id);
            resposta.json({ message: "Via deletada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                resposta.status(500).json({ error: error.message });
            } else {
                resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    };
}

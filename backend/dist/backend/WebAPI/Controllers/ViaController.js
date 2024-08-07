"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaController = void 0;
class ViaController {
    constructor(service) {
        this.getViaById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const via = await this.service.getViaById(id);
                console.log("Endpoint GET /vias/:id foi chamado");
                res.status(200).json(via);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ error: error.message });
                }
                else {
                    return res.status(500).json({ error: "An unknown error occurred" });
                }
            }
        };
        this.getAllVia = async (req, res) => {
            try {
                const page = req.query.page ? parseInt(req.query.page) : undefined;
                const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                const result = await this.service.getVias(page, limit);
                console.log('Endpoint GET /vias foi chamado');
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller getAllVia' });
                }
            }
        };
        this.createVia = async (requisicao, resposta) => {
            try {
                const via = requisicao.body;
                await this.service.createVia(via);
                resposta.status(201).json({ message: "Via criada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "É necessário existir uma Fonte antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "É necessário existir uma montanha antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "É necessário existir uma Face antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "Erro ao criar a via.") {
                        return resposta.status(401).json({ error: "Erro provavelmente na escrita sql" });
                    }
                    else {
                        return resposta.status(500).json({ error: error.message });
                    }
                }
                else {
                    return resposta.status(500).json({ error: "Ocorreu um erro desconhecido em controller createVia" });
                }
            }
        };
        this.updateVia = async (requisicao, resposta) => {
            try {
                const via = requisicao.body;
                await this.service.updateVia(via.id, via);
                resposta.json({ message: "Via atualizada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "É necessário existir uma Fonte antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "É necessário existir uma montanha antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "É necessário existir uma Face antes da criação da via") {
                        return resposta.status(400).json({ error: error.message });
                    }
                    else if (error.message === "Erro ao atualizar via.") {
                        return resposta.status(401).json({ error: "Erro provavelmente na consulta escrita sql" });
                    }
                    else {
                        return resposta.status(500).json({ error: error.message });
                    }
                }
                else {
                    return resposta.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateVia" });
                }
            }
        };
        this.deleteVia = async (requisicao, resposta) => {
            try {
                const id = parseInt(requisicao.params.id);
                await this.service.deleteVia(id);
                resposta.json({ message: "Via deletada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada") {
                        return resposta.status(404).json({ error: error.message });
                    }
                    resposta.status(500).json({ error: error.message });
                }
            }
        };
        this.getViasInColecao = async (req, res) => {
            try {
                const colecaoId = parseInt(req.params.id);
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                console.log("Endpoint GET /vias/colecao/:id foi chamado", colecaoId, "page", page, "limit", limit);
                const result = await this.service.getViasIdByColecaoId(colecaoId, page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Nenhuma via encontrada") {
                        return res.status(404).json({ error: error.message });
                    }
                    else {
                        res.status(500).json({ error: error.message });
                    }
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getViasIn" });
                }
            }
        };
        this.getViasNotInColecao = async (req, res) => {
            try {
                const colecaoId = parseInt(req.params.id);
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = await this.service.getViasNotInColecaoId(colecaoId, page, limit);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Nenhuma via encontrada") {
                        return res.status(404).json({ error: error.message });
                    }
                    else {
                        res.status(500).json({ error: error.message });
                    }
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getViasNotIn" });
                }
            }
        };
        this.service = service;
    }
}
exports.ViaController = ViaController;

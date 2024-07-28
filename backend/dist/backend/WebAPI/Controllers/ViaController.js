"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaController = void 0;
class ViaController {
    constructor(service) {
        /**
         * @route GET /vias/:id
         * @group Vias - Operações relacionadas a vias
         * @returns {Via.model} 200 - Via encontrada
         * @returns {object} 404 - Via não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getViaById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const via = await this.service.getViaById(id);
                if (!via) {
                    return res.status(404).json({ message: "Via não encontrada" });
                }
                res.status(200).json(via);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada") {
                        return res.status(400).json({ message: error.message });
                    }
                    else {
                        return res.status(500).json({ error: error.message });
                    }
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
        this.getAllVia = async (_, resposta) => {
            try {
                const vias = await this.service.getVias();
                resposta.json(vias);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Nenhuma via encontrada") {
                        return resposta.status(404).json({ error: error.message });
                    }
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllVia" });
                }
            }
        };
        /**
         * @route POST /vias
         * @group Vias - Operações relacionadas a vias
         * @returns {object} 201 - Via criada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
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
        /**
         * @route PUT /vias
         * @group Vias - Operações relacionadas a vias
         * @returns {object} 200 - Via atualizada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
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
        /**
         * @route DELETE /vias/:id
         * @group Vias - Operações relacionadas a vias
         * @returns {object} 200 - Via deletada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Via não encontrada
         */
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
        /**
         * @route GET /vias/colecao/:id
         * @group Vias - Operações relacionadas a vias
         * @returns {Array.<Via>} 200 - Vias encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Via não encontrada
         */
        this.getViasInColecao = async (req, res) => {
            try {
                const colecaoId = parseInt(req.params.id);
                const vias = await this.service.getViasIdByColecaoId(colecaoId);
                res.status(200).json(vias);
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
        this.service = service;
    }
}
exports.ViaController = ViaController;

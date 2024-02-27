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
                res.status(200).json(via);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada.") {
                        return res.status(404).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ error: "Ocorreu um erro ao buscar Via" });
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
                    if (error.message === "Nenhuma via encontrada.") {
                        return resposta.status(404).json({ message: error.message });
                    }
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
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
                resposta.status(201).json({ message: "Via criada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via já existente") {
                        return resposta.status(400).json({ message: error.message });
                    }
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
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
                await this.service.updateVia(via);
                resposta.json({ message: "Via atualizada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada.") {
                        return resposta.status(404).json({ message: error.message });
                    }
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
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
                resposta.json({ message: "Via deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada.") {
                        return resposta.status(404).json({ message: error.message });
                    }
                    resposta.status(500).json({ error: error.message });
                }
                else {
                    resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route GET /vias/:id/croquis
         * @group Vias - Operações relacionadas a vias e croquis
         * @returns {object} 200 - Croquis encontrados com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 400 - Via não encontrada
         * @returns {object} 404 - Nenhum croqui encontrado para a Via com ID fornecido
         */
        this.getCroquisByViaId = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const croquis = await this.service.getCroquisByViaId(id);
                res.status(200).json(croquis);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Via não encontrada.") {
                        return res.status(400).json({ message: error.message });
                    }
                    else if (error.message === "Nenhum croqui encontrado.") {
                        return res.status(404).json({ message: error.message });
                    }
                }
                res.status(500).json({ error: "Ocorreu um erro desconhecido" });
            }
        };
        this.service = service;
    }
}
exports.ViaController = ViaController;

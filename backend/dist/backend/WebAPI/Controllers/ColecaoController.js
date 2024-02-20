"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoController = void 0;
class ColecaoController {
    constructor(colecaoaService, viaService) {
        /**
         * @route GET /colecaoes/:id
         * @group Colecaoes - Operações relacionadas a Colecaoes
         * @returns {Colecao.model} 200 - Colecao encontrada
         * @returns {object} 404 - Colecao não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getColecaoById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const colecao = await this.service.getColecaoById(id);
                res.json(colecao);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Colecao não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route GET /colecaos
         * @group Colecaos - Operações relacionadas a Colecaos
         * @returns {Array.<Colecao>} 200 - Colecaos encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Colecao não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllColecao = async (_, res) => {
            try {
                const colecoes = await this.service.getColecoes();
                res.json(colecoes);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Nenhuma coleção encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route GET /colecaos/colecoesDoUsuario/:usuarioId
         * @group Colecoes - Operações relacionadas a Colecoes
         * @returns {object} 201 - Colecoes encontradas com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getColecoesByUsuarioId = async (req, res) => {
            try {
                const usuarioId = Number(req.params.usuarioId);
                const colecoes = await this.service.getColecoesByUsuarioId(usuarioId);
                res.status(200).json(colecoes);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Nenhuma coleção encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    else if (error.message === "Usuário não informado") {
                        return res.status(400).json({ error: error.message });
                    }
                    else if (error.message === "Usuário inválido") {
                        return res.status(400).json({ error: error.message });
                    }
                    else {
                        res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                    }
                }
            }
        };
        // TODO: Validar existencia do endpoint
        this.getViasByColecao = async (req, res) => {
            try {
            }
            catch (error) {
            }
        };
        /**
         * @route POST /colecaos
         * @group Colecoes - Operações relacionadas a Colecoes
         * @returns {object} 201 - Colecao criada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.createColecao = async (req, res) => {
            try {
                const colecao = req.body;
                await this.service.createColecao(colecao);
                res.status(201).json({ message: "Colecao criada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route PUT /colecoes
         * @group Colecoes - Operações relacionadas a colecoes
         * @returns {object} 200 - Colecao atualizada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.updateColecao = async (req, res) => {
            try {
                const colecao = req.body;
                await this.service.updateColecao(colecao);
                res.status(200).json({ message: "Colecao atualizada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Colecao não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route DELETE /colecoes/:id
         * @group Colecoes - Operações relacionadas a colecoes
         * @returns {colecao-id} 200 - Colecao deletada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Colecao não encontrada
         */
        this.deleteColecao = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                await this.service.deleteColecao(id);
                res.status(200).json({ message: "Colecao deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Colecao não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route ADD Via /colecoes/addVia
         * @group Colecoes - Operações relacionadas a colecoes
         * @returns {object} 200 - Via adicionada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Colecao não encontrada
         * @param req
         * @param res
         */
        this.addVia = async (req, res) => {
            try {
                const { colecao_id, via_id } = req.body;
                const colecaoId = (colecao_id);
                const viaId = (via_id);
                await this.service.addVia(viaId, colecaoId);
                res.status(201).json({ message: 'Via adicionada à coleção com sucesso.' });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Coleção não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    else if (error.message === "Via não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
         * @route ADD Via /colecoes/removeVia/:colecaoId/:viaId
         * @group Colecoes - Operações relacionadas a colecoes
         * @returns {object} 200 - Via removida da coleção com sucesso
         * @param {colecao_id, via_id} - passado como parametro http
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Colecao não encontrada
         */
        this.removeVia = async (req, res) => {
            try {
                const colecaoId = Number(req.params.colecaoId);
                const viaId = Number(req.params.viaId);
                await this.service.removeVia(viaId, colecaoId);
                res.status(200).json({ message: 'Via removida da coleção com sucesso.' });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Coleção não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                    else if (error.message === "Via não encontrada") {
                        return res.status(404).json({ message: error.message });
                    }
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        this.service = colecaoaService;
        this.viaService = viaService;
    }
}
exports.ColecaoController = ColecaoController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaController = void 0;
class EscaladaController {
    constructor(escaladaService, usuarioService) {
        /**
         * @route GET /escaladas/:id
         * @group Escaladas - Operações relacionadas a escaladas
         * @returns {Escalada.model} 200 - Escalada encontrada
         * @returns {object} 404 - Escalada não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getEscaladaById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const result = await this.service.getEscaladaById(id);
                if (!result) {
                    return res.status(404).json({ message: "Escalada não encontrada." });
                }
                res.json(result);
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
         * @route GET /escaladas/:id
         * @group Escaladas - Operações relacionadas a escaladas
         * @returns {Array.<Escalada>} 200 - Escaladas encontradas
         * @returns {object} 404 - Escalada não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getEscaladasDoUsuario = async (req, res) => {
            try {
                const usuarioId = parseInt(req.params.usuarioId);
                const result = await this.service.getEscaladasDoUsuario(usuarioId);
                if (!result) {
                    return res.status(404).json({ message: "Usuario não encontrada." });
                }
                res.json(result);
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
         * @route GET /escaladas
         * @group Escaladas - Operações relacionadas a escaladas
         * @returns {Array.<Escalada>} 200 - Escaladas encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Escalada não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllEscalada = async (req, res) => {
            try {
                const escaladas = await this.service.getEscaladas();
                if (escaladas?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma escalada encontrada" });
                }
                res.json(escaladas);
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
         * @route POST /escaladas
         * @group Escaladas - Operações relacionadas a escaladas
         * @returns {object} 201 - Escalada criada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.createEscalada = async (req, res) => {
            try {
                const escalada = req.body;
                await this.service.createEscalada(escalada);
                res.status(201).json({ message: "Escalada criada com sucesso." });
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
         * @route PUT /escaladas
         * @group Escaladas - Operações relacionadas a Escaladas
         * @returns {object} 200 - Escalada atualizada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.updateEscalada = async (req, res) => {
            const escalada = req.body;
            await this.service.updateEscalada(escalada);
            res.status(200).send();
        };
        /**
         * @route DELETE /escaladas/:id
         * @group Escaladas - Operações relacionadas a Escaladas
         * @returns {object} 200 - Escalada deletada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Escalada não encontrada
         */
        this.deleteEscalada = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                await this.service.deleteEscalada(id);
                res.status(200).json({ message: "Escalada deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Escalada não encontrada.") {
                        res.status(404).json({ error: error.message });
                    }
                    else {
                        res.status(500).json({ error: error.message });
                    }
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        this.service = escaladaService;
        this.usuarioService = usuarioService;
    }
}
exports.EscaladaController = EscaladaController;

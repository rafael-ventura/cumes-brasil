"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaController = void 0;
class MontanhaController {
    constructor(montanhaService) {
        /**
         * @route GET /montanhas/:id
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {Montanha.model} 200 - montanha encontrada
         * @returns {object} 404 - montanha não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getMontanhaById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const result = await this.service.getMontanhaById(id);
                if (!result) {
                    return res.status(404).json({ message: "montanha não encontrada." });
                }
                res.json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getMontanhaById" });
                }
            }
        };
        /**
         * @route GET /montanhas
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {Array.<Montanha>} 200 - Montanhas encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - montanha não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllMontanha = async (req, res) => {
            try {
                const montanhas = await this.service.getMontanhas();
                if (montanhas?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma montanha encontrada" });
                }
                res.json(montanhas);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllMontanha" });
                }
            }
        };
        /**
         * @route POST /montanhas
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {object} 201 - montanha criada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.createMontanha = async (req, res) => {
            try {
                const montanha = req.body;
                await this.service.createMontanha(montanha);
                res.status(201).json({ message: "montanha criada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Fonte não encontrada") {
                        return res.status(400).json({ error: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller createMontanha" });
                }
            }
        };
        /**
         * @route PUT /montanhas
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {object} 200 - montanha atualizada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.updateMontanha = async (req, res) => {
            try {
                const montanha = req.body;
                await this.service.updateMontanha(montanha.id, montanha);
                res.json({ message: "montanha atualizada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "montanha não encontrada") {
                        return res.status(400).json({ error: error.message });
                    }
                    else if (error.message === "Fonte não encontrada") {
                        return res.status(400).json({ error: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateMontanha" });
                }
            }
        };
        /**
         * @route DELETE /montanhas/:id
         * @group Montanhas - Operações relacionadas a montanhas
         * @returns {object} 200 - montanha deletada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - montanha não encontrada
         */
        this.deleteMontanha = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                await this.service.deleteMontanha(id);
                res.status(200).json({ message: "montanha deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "montanha não encontrada") {
                        return res.status(400).json({ error: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido em controller deleteMontanha" });
                }
            }
        };
        this.service = montanhaService;
    }
}
exports.MontanhaController = MontanhaController;

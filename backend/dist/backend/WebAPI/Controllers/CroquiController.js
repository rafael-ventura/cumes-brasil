"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroquiController = void 0;
class CroquiController {
    constructor(croquiService, viaService) {
        /**
         * @route GET /croquis/:id
         * @group Croquis - Operações relacionadas a croquis
         * @returns {Croqui.model} 200 - Croqui encontrada
         * @returns {object} 404 - Croqui não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getCroquiById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const result = await this.service.getCroquiById(id);
                if (!result) {
                    return res.status(404).json({ message: "Croqui não encontrada." });
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
         * @route GET /croquis
         * @group Croquis - Operações relacionadas a croquis
         * @returns {Array.<Croqui>} 200 - Croquis encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Croqui não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllCroqui = async (req, res) => {
            try {
                const croquis = await this.service.getCroquis();
                if (croquis?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma croqui encontrada" });
                }
                res.json(croquis);
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
         * @route POST /croquis
         * @group Croquis - Operações relacionadas a croquis
         * @returns {object} 201 - Croqui criada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.createCroqui = async (req, res) => {
            try {
                const croqui = req.body;
                await this.service.createCroqui(croqui);
                res.status(201).json({ message: "Croqui criada com sucesso." });
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
         * @route PUT /croquis
         * @group Croquis - Operações relacionadas a croquis
         * @returns {object} 200 - Croqui atualizada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         */
        this.updateCroqui = async (req, res) => {
            try {
                const croqui = req.body;
                await this.service.updateCroqui(croqui);
                res.status(200).json({ message: "Croqui atualizada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Croqui não encontrada.") {
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
        /**
         * @route DELETE /croquis/:id
         * @group Croquis - Operações relacionadas a croquis
         * @returns {object} 200 - Croqui deletada com sucesso
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Croqui não encontrada
         */
        this.deleteCroqui = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                await this.service.deleteCroqui(id);
                res.status(200).json({ message: "Croqui deletada com sucesso." });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Croqui não encontrada.") {
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
        // funão não usada
        this.getCroquisByViaId = async (req, res) => {
            try {
                const croquis = await this.service.getCroquis();
                if (croquis?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma croqui encontrada" });
                }
                res.json(croquis);
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
         * @route POST /croquis/associarVia
         * @group Croquis - Operações relacionadas a croquis e vias
         * @returns {via_id, croqui_id} 201 - Croqui associado a Via com sucesso
         * @param {via_id, croqui_id} - passado no corpo da requisicao
         * @returns {object} 404 - Croqui ou Via não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.associarVia = async (req, res) => {
            try {
                const { via_id, croqui_id } = req.body; //Obtendo dados do corpo da requisiçao
                const viaId = (via_id);
                const croquiId = (croqui_id);
                if (!viaId || !croquiId) {
                    return res.status(400).json({ error: 'Erro na passagem de Ids. Id invalido' });
                }
                const via = await this.viaService.getViaById(viaId);
                if (!via) {
                    return res.status(404).json({ message: 'Via não encontrada' });
                }
                const croqui = await this.service.getCroquiById(croquiId);
                if (!croqui) {
                    return res.status(404).json({ message: 'Croqui não encontrado' });
                }
                await this.service.associarCroquiEmVia(croquiId, viaId);
                res.status(201).json({ message: 'Croqui associado a Via com sucesso' });
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
         * @route DELETE /croquis/desassociarVia/:viaId/:croquiId
         * @group Croquis - Operações relacionadas a croquis e vias
         * @returns {via_id, croqui_id} 201 - Croqui desassociado a Via com sucesso
         * @param {via_id, croqui_id} - passado como parametro http
         * @returns {object} 404 - Croqui ou Via não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.desassociar = async (req, res) => {
            try {
                const viaId = Number(req.params.viaId);
                const croquiId = Number(req.params.croquiId);
                if (!viaId || !croquiId) {
                    return res.status(400).json({ error: 'Erro na passagem de parametro' });
                }
                await this.service.desassociarCroquiEmVia(croquiId, viaId);
                res.status(200).json({ message: 'Croqui desassociado a Via com sucesso' });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Ocorreu um erro desconhecido' });
                }
            }
        };
        this.service = croquiService;
        this.viaService = viaService;
    }
}
exports.CroquiController = CroquiController;

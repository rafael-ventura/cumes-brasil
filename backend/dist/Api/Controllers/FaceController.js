"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceController = void 0;
class FaceController {
    constructor(faceService) {
        /**
         * @route GET /faces/:id
         * @group Face - Operações relacionadas a Face
         * @returns {Face.model} 200 - Face encontrada
         * @returns {object} 404 - Face não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getFaceById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const result = await this.service.getFaceById(id);
                if (!result) {
                    return res.status(404).json({ error: "Face não encontrada" });
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
         * @route GET /Faces
         * @group Face - Operações relacionadas a Face
         * @returns {Array.<Face>} 200 - Vias encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Face não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllFace = async (req, res) => {
            try {
                const faces = await this.service.getFaces();
                if (faces?.length === 0) {
                    return res.status(404).json({ error: "Nenhuma Face encontrada" });
                }
                res.json(faces);
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
           * @route POST /Faces
           * @group Face - Operações relacionadas a faces
           * @returns {object} 201 - Face criada com sucesso
           * @returns {Error} 500 - Erro desconhecido
           */
        this.createFace = async (req, res) => {
            try {
                const face = req.body;
                await this.service.createFace(face);
                res.status(201).json({ message: "Face criada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "É necessário existir uma Fonte antes da criação da via") {
                        res.status(400).json({ error: error.message });
                    }
                    else if (error.message === "É necessário existir uma montanha antes da criação da via") {
                        res.status(400).json({ error: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
           * @route PUT /Faces
           * @group Faces - Operações relacionadas a faces
           * @returns {object} 200 - Face atualizada com sucesso
           * @returns {Error} 500 - Erro desconhecido
           */
        this.updateFace = async (req, res) => {
            try {
                const face = req.body;
                await this.service.updateFace(face.id, face);
                res.status(200).json({ message: "Face atualizada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Face não encontrada") {
                        res.status(404).json({ error: error.message });
                    }
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "Ocorreu um erro desconhecido" });
                }
            }
        };
        /**
           * @route DELETE /faces/:id
           * @group Faces - Operações relacionadas a faces
           * @returns {object} 200 - Face deletada com sucesso
           * @returns {Error} 500 - Erro desconhecido
           * @returns {object} 404 - Face não encontrada
           */
        this.deleteFace = async (req, res) => {
            try {
                const id = Number(req.params.id);
                await this.service.deleteFace(id);
                res.status(201).json({ message: "Face deletada com sucesso" });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Face não encontrada") {
                        return res.status(404).json({ error: error.message });
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
        this.service = faceService;
    }
}
exports.FaceController = FaceController;

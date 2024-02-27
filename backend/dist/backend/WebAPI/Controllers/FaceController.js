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
                    return res.status(404).json({ message: "Face não encontrada." });
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
         * @group Face - Operações relacionadas a face
         * @returns {Array.<Face>} 200 - Vias encontradas
         * @returns {Error} 500 - Erro desconhecido
         * @returns {object} 404 - Face não encontrada
         * @returns {Error} 500 - Erro desconhecido
         */
        this.getAllFace = async (req, res) => {
            try {
                const faces = await this.service.getFaces();
                if (faces?.length === 0) {
                    return res.status(404).json({ message: "Nenhuma face encontrada" });
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
            const face = req.body;
            await this.service.updateFace(face);
            res.status(200).send();
        };
        /**
           * @route DELETE /faces/:id
           * @group Faces - Operações relacionadas a faces
           * @returns {object} 200 - Face deletada com sucesso
           * @returns {Error} 500 - Erro desconhecido
           * @returns {object} 404 - Face não encontrada
           */
        this.deleteFace = async (req, res) => {
            const id = Number(req.params.id);
            await this.service.deleteFace(id);
            res.status(200).send();
        };
        this.service = faceService;
    }
}
exports.FaceController = FaceController;

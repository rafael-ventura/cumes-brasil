import {Request, Response} from "express";
import {FaceService} from "../../Application/services/FaceService";
import {Face} from "../../Domain/models/Face";

export class FaceController {
  private service: FaceService;

  constructor(faceService: FaceService) {
    this.service = faceService;
  }

  /**
   * @route GET /faces/:id
   * @group Face - Operações relacionadas a Face
   * @returns {Face.model} 200 - Face encontrada
   * @returns {object} 404 - Face não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getFaceById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.getFaceById(id);
      if (!result) {
        return res.status(404).json({ message: "Face não encontrada." });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
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
  getAllFace = async (req: Request, res: Response) => {
    try {
      const faces = await this.service.getFaces();
      if (faces?.length === 0) {
        return res.status(404).json({message: "Nenhuma face encontrada"});
      }
      res.json(faces);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
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
  createFace = async (req: Request, res: Response) => {
    try {
      const face: Face = req.body;
      await this.service.createFace(face);
      res.status(201).json({ message: "Face criada com sucesso" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
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
  updateFace = async (req: Request, res: Response) => {
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
  deleteFace = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.service.deleteFace(id);
    res.status(200).send();
  };
}

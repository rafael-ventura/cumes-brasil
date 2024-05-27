import { Request, Response } from "express";
import { FaceService } from "../../Application/services/FaceService";
import { Face } from "../../Domain/entities/Face";

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
				return res.status(404).json({ error: "Face não encontrada" });
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
	 * @group Face - Operações relacionadas a Face
	 * @returns {Array.<Face>} 200 - Vias encontradas
	 * @returns {Error} 500 - Erro desconhecido
	 * @returns {object} 404 - Face não encontrada
	 * @returns {Error} 500 - Erro desconhecido
	 */
	getAllFace = async (req: Request, res: Response) => {
		try {
			const faces = await this.service.getFaces();
			if (faces?.length === 0) {
				return res.status(404).json({ error: "Nenhuma Face encontrada" });
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
				if (error.message === "É necessário existir uma Fonte antes da criação da via") {
					res.status(400).json({ error: error.message });
				} else if (error.message === "É necessário existir uma montanha antes da criação da via") {
					res.status(400).json({ error: error.message });
				}
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
		try {
			const face: Face = req.body;
			await this.service.updateFace(face.id, face);
			res.status(200).json({ message: "Face atualizada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Face não encontrada") {
					res.status(404).json({ error: error.message });
				}
				res.status(500).json({ error: error.message });
			} else {
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
	deleteFace = async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id);
			await this.service.deleteFace(id);
			res.status(201).json({ message: "Face deletada com sucesso" });
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Face não encontrada") {
					return res.status(404).json({ error: error.message });
				} else {
					res.status(500).json({ error: error.message });
				}
			} else {
				res.status(500).json({ error: "Ocorreu um erro desconhecido" });
			}
		}

	};
}

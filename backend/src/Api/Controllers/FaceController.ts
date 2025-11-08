import { Request, Response } from "express";
import { FaceService } from "../../Application/services/FaceService";
import { Face } from "../../Domain/entities/Face";
import { NotFoundError } from '../../Application/errors';
import FaceValidation from '../../Application/validations/FaceValidation';

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
		const id = FaceValidation.idParam(req.params.id);
		const result = await this.service.getFaceById(id);
		if (!result) {
			throw new NotFoundError("Face não encontrada");
		}
		res.json(result);
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
		const faces = await this.service.getFaces();
		if (faces?.length === 0) {
			throw new NotFoundError("Nenhuma Face encontrada");
		}
		res.json(faces);
	};

	/**
	   * @route POST /Faces
	   * @group Face - Operações relacionadas a faces
	   * @returns {object} 201 - Face criada com sucesso
	   * @returns {Error} 500 - Erro desconhecido
	   */
	createFace = async (req: Request, res: Response) => {
		const face: Face = req.body;
		FaceValidation.createBody(face);
		await this.service.createFace(face);
		res.status(201).json({ message: "Face criada com sucesso" });
	};

	/**
	   * @route PUT /Faces
	   * @group Faces - Operações relacionadas a faces
	   * @returns {object} 200 - Face atualizada com sucesso
	   * @returns {Error} 500 - Erro desconhecido
	   */
	updateFace = async (req: Request, res: Response) => {
		const face: Face = req.body;
		FaceValidation.updateBody(face);
		await this.service.updateFace(face.id, face);
		res.status(200).json({ message: "Face atualizada com sucesso" });
	};

	/**
	   * @route DELETE /faces/:id
	   * @group Faces - Operações relacionadas a faces
	   * @returns {object} 200 - Face deletada com sucesso
	   * @returns {Error} 500 - Erro desconhecido
	   * @returns {object} 404 - Face não encontrada
	   */
	deleteFace = async (req: Request, res: Response) => {
		const id = FaceValidation.idParam(req.params.id);
		await this.service.deleteFace(id);
		res.status(201).json({ message: "Face deletada com sucesso" });
	};
}

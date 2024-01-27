import {CroquiService} from "../../Application/services/CroquiService";
import {Request, Response} from "express";
import {Croqui} from "../../Domain/models/Croqui";

export class CroquiController {
  private service: CroquiService;

  constructor(croquiService: CroquiService) {
    this.service = croquiService;
  }

  /**
   * @route GET /croquis/:id
   * @group Croquis - Operações relacionadas a croquis
   * @returns {Croqui.model} 200 - Croqui encontrada
   * @returns {object} 404 - Croqui não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getCroquiById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.getCroquiById(id);
      if (!result) {
        return res.status(404).json({message: "Croqui não encontrada."});
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({error: error.message});
      } else {
        res.status(500).json({error: "Ocorreu um erro desconhecido"});
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
  getAllCroqui = async (req: Request, res: Response) => {
    try {
      const croquis: Croqui[] | null = await this.service.getCroquis();
      if (croquis?.length === 0) {
        return res.status(404).json({message: "Nenhuma croqui encontrada"});
      }
      res.json(croquis);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({error: error.message});
      } else {
        res.status(500).json({error: "Ocorreu um erro desconhecido"});
      }
    }
  };

  /**
   * @route POST /croquis
   * @group Croquis - Operações relacionadas a croquis
   * @returns {object} 201 - Croqui criada com sucesso
   * @returns {Error} 500 - Erro desconhecido
   */
  createCroqui = async (req: Request, res: Response) => {
    try {
      const croqui = req.body;
      await this.service.createCroqui(croqui);
      res.status(201).json({message: "Croqui criada com sucesso."});
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
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
  updateCroqui = async (req: Request, res: Response) => {
    try {
      const croqui: Croqui = req.body;
      await this.service.updateCroqui(croqui);
      res.status(200).json({message: "Croqui atualizada com sucesso."});
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Croqui não encontrada.") {
          res.status(404).json({error: error.message});
        } else {
          res.status(500).json({error: error.message});
        }
      } else {
        res.status(500).json({error: "Ocorreu um erro desconhecido"});
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
  deleteCroqui = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteCroqui(id);
      res.status(200).json({message: "Croqui deletada com sucesso."});
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Croqui não encontrada.") {
          res.status(404).json({error: error.message});
        } else {
          res.status(500).json({error: error.message});
        }
      } else {
        res.status(500).json({error: "Ocorreu um erro desconhecido"});
      }
    }
  };
}

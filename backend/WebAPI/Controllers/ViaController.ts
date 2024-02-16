import {Request, Response} from "express";
import {ViaService} from "../../Application/services/ViaService";
import {Via} from "../../Domain/models/Via";
import {CroquiService} from "../../Application/services/CroquiService";

export class ViaController {
  private service: ViaService;
  private croquiService: CroquiService;

  constructor(service: ViaService, croquiService: CroquiService) {
    this.service = service;
    this.croquiService = croquiService;
  }

  /**
   * @route GET /vias/:id
   * @group Vias - Operações relacionadas a vias
   * @returns {Via.model} 200 - Via encontrada
   * @returns {object} 404 - Via não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getViaById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const via = await this.service.getViaById(id);
      res.status(200).json(via);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Via não encontrada.") {
          return res.status(404).json({message: error.message});
        } else {
          res.status(500).json({error: "Ocorreu um erro ao buscar Via"});
        }
      }
    }
  };

  /**
   * @route GET /vias
   * @group Vias - Operações relacionadas a vias
   * @returns {Array.<Via>} 200 - Vias encontradas
   * @returns {Error} 500 - Erro desconhecido
   * @returns {object} 404 - Via não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getAllVia = async (_: Request, resposta: Response) => {
    try {
      const vias: Via[] | null = await this.service.getVias();
      resposta.json(vias);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nenhuma via encontrada.") {
          return resposta.status(404).json({message: error.message});
        }
      } else {
        resposta.status(500).json({error: "Ocorreu um erro desconhecido"});
      }
    }
  };

  /**
   * @route POST /vias
   * @group Vias - Operações relacionadas a vias
   * @returns {object} 201 - Via criada com sucesso
   * @returns {Error} 500 - Erro desconhecido
   */
  createVia = async (requisicao: Request, resposta: Response) => {
    try {
      const via: Via = requisicao.body;
      await this.service.createVia(via);
      resposta.status(201).json({ message: "Via criada com sucesso." });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Via já existente") {
          return resposta.status(400).json({message: error.message});
        }
      } else {
        resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
      }
    }
  };

  /**
   * @route PUT /vias
   * @group Vias - Operações relacionadas a vias
   * @returns {object} 200 - Via atualizada com sucesso
   * @returns {Error} 500 - Erro desconhecido
   */
  updateVia = async (requisicao: Request, resposta: Response) => {
    try {
      const via: Via = requisicao.body;
      await this.service.updateVia(via);
      resposta.json({ message: "Via atualizada com sucesso." });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Via não encontrada.") {
          return resposta.status(404).json({ message: error.message });
        }
        resposta.status(500).json({ error: error.message });
      } else {
        resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
      }
    }
  };

  /**
   * @route DELETE /vias/:id
   * @group Vias - Operações relacionadas a vias
   * @returns {object} 200 - Via deletada com sucesso
   * @returns {Error} 500 - Erro desconhecido
   * @returns {object} 404 - Via não encontrada
   */
  deleteVia = async (requisicao: Request, resposta: Response) => {
    try {
      const id = parseInt(requisicao.params.id);
      await this.service.deleteVia(id);
      resposta.json({ message: "Via deletada com sucesso." });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Via não encontrada.") {
          return resposta.status(404).json({ message: error.message });
        }
        resposta.status(500).json({ error: error.message });
      } else {
        resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
      }
    }
  };

  /**
   * @route GET /vias/:id/croquis
   * @group Vias - Operações relacionadas a vias e croquis
   * @returns {object} 200 - Croquis encontrados com sucesso
   * @returns {Error} 500 - Erro desconhecido
   * @returns {object} 400 - Via não encontrada
   * @returns {object} 404 - Nenhum croqui encontrado para a Via com ID fornecido
   */
  getCroquisByViaId = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const croquis = await this.service.getCroquisByViaId(id);
      res.status(200).json(croquis);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Via não encontrada.") {
          return res.status(400).json({message: error.message});
        } else if (error.message === "Nenhum croqui encontrado.") {
          return res.status(404).json({message: error.message});
        }
      }
      res.status(500).json({error: "Ocorreu um erro desconhecido"});
    }
  };
}

import { Request, Response } from "express";
import { ViaService } from "../../Application/services/ViaService";
import { Via } from "../../Domain/models/Via";
import { Croqui } from "../../Domain/models/Croqui";
import { CroquiService } from "../../Application/services/CroquiService";

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

      if (!via) {
        return res.status(400).json({ error: "Via não encontrada." });
      }
      // Se o array de croqui estiver vazio, obter os IDs e informações dos croquis associados à via
      if (via.croquis && via.croquis.length === 0) {
        const croquiIds = await this.service.getCroquiIdsByViaId(id);

        // Verificar se croquiIds é null antes de mapear
        if (croquiIds !== null) {
          const croquiList: Croqui[] = [];
          for (const croquiId of croquiIds) {
            const croquiInfo = await this.croquiService.getCroquiById(croquiId);
            if (croquiInfo) {
              croquiList.push(croquiInfo);
            }
          }
          via.croquis = croquiList;
        }
      }
      res.status(200).json(via);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ocorreu um erro ao buscar Via da Via" });
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

      if (!vias || vias.length === 0) {
        return resposta.status(404).json({ message: "Via não encontrada." });
      }

      // Para cada via, obter os IDs dos croquis associados
      const viasComCroquis = await Promise.all(
        vias.map(async (via) => {
          if (via.croquis && via.croquis.length === 0) {
            const croquiIds = await this.service.getCroquiIdsByViaId(via.id);

            // Se croquiIds não for null, atribuir à via
            if (croquiIds !== null) {
              via.croquis = croquiIds.map(
                (croquiId) => ({ id: croquiId } as Croqui)
              );
            }
          }
          return via;
        })
      );

      resposta.json(viasComCroquis);
    } catch (error) {
      if (error instanceof Error) {
        resposta.status(500).json({ error: error.message });
      } else {
        resposta.status(500).json({ error: "Ocorreu um erro desconhecido" });
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
        resposta.status(500).json({ error: error.message });
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
      const resultado = await this.service.getViaById(id);

      if (!resultado) {
        return res.status(400).json({ error: "Via não encontrada." });
      }

      const croquis = await this.service.getCroquisByViaId(id);

      if (croquis === null) {
        return res
          .status(404)
          .json({
            message: "Nenhum croqui encontrado para a Via com ID fornecido",
          });
      }

      res.status(200).json(croquis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ocorreu um erro ao buscar Via da Via" });
    }
  };
}

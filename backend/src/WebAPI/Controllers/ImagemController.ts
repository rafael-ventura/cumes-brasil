import { Request, Response } from "express";
import { ImagemService } from "../../Application/services/ImagemService";
import { Imagem } from "../../Domain/entities/Imagem";

export class ImagemController {
  private service: ImagemService;

  constructor (imagemService: ImagemService) {
    this.service = imagemService;
  }

  /**
   * @route GET /imagens/:id
   * @group Imagem - Operações relacionadas a Imagem
   * @returns {Imagem.model} 200 - Imagem encontrada
   * @returns {object} 404 - Imagem não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getImagemById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.getImagemById(id);
      if (!result) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getImagemById" });
      }
    }

  };

  /**
   * @route GET /imagens
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagem não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  getAllImagem = async (_: Request, res: Response) => {
    try {
      const result: Imagem[] | null = await this.service.getImagens();
      if (result?.length === 0) {
        return res.status(404).json({ error: "Nenhuma Imagem encontrada" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllImagem" });
      }
    }

  };

  /**
   * @route POST /imagens
   * @group Imagem - Operações relacionadas a imagens
   * @param {Imagem.model} Imagem.body.required - Nova Imagem
   * @returns {void} 201 - Imagem criada
   * @returns {Error} 500 - Erro desconhecido
   */
  createImagem = async (req: Request, res: Response) => {
    try {
      const imagem: Imagem = req.body;
      await this.service.createImagem(imagem);
      res.status(201).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller createImagem" });
      }
    }
  };

  /**
   * @route PUT /imagens/:id
   * @group Imagem - Operações relacionadas a imagens
   * @param {Imagem.model} Imagem.body.required - Imagem atualizada
   * @returns {void} 204 - Imagem atualizada
   * @returns {object} 404 - Imagem não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  updateImagem = async (req: Request, res: Response) => {
    try {
      const imagem: Imagem = req.body;
      await this.service.updateImagem(imagem.id, imagem);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateImagem" });
      }
    }
  };

  /**
   * @route DELETE /imagens/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {void} 204 - Imagem deletada
   * @returns {object} 404 - Imagem não encontrada
   * @returns {Error} 500 - Erro desconhecido
   */
  deleteImagem = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteImagem(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Imagem não encontrada") {
          return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller deleteImagem" });
      }
    }
  };

  /**
   * @route GET /imagens/colecao/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagens não encontradas
   * @returns {Error} 500 - Erro desconhecido
   */
  getByColecaoId = async (req: Request, res: Response) => {
    try {
      const colecaoId = parseInt(req.params.id);
      const result = await this.service.getByColecaoId(colecaoId);
      if (!result) {
        return res.status(404).json({ error: "Imagens não encontradas" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getByColecaoId" });
      }
    }
  };

  /**
   * @route GET /imagens/usuario/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagens não encontradas
   * @returns {Error} 500 - Erro desconhecido
   */
  getByUsuarioId = async (req: Request, res: Response) => {
    try {
      const usuarioId = parseInt(req.params.id);
      const result = await this.service.getByUsuarioId(usuarioId);
      if (!result) {
        return res.status(404).json({ error: "Imagens não encontradas" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getByUsuarioId" });
      }
    }
  };

  /**
   * @route GET /imagens/montanha/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagens não encontradas
   * @returns {Error} 500 - Erro desconhecido
   */
  getByMontanhaId = async (req: Request, res: Response) => {
    try {
      const montanhaId = parseInt(req.params.id);
      const result = await this.service.getByMontanhaId(montanhaId);
      if (!result) {
        return res.status(404).json({ error: "Imagens não encontradas" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getByMontanhaId" });
      }
    }
  };

  /**
   * @route GET /imagens/via/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagens não encontradas
   * @returns {Error} 500 - Erro desconhecido
   */
  getByViaId = async (req: Request, res: Response) => {
    try {
      const viaId = parseInt(req.params.id);
      const result = await this.service.getByViaId(viaId);
      if (!result) {
        return res.status(404).json({ error: "Imagens não encontradas" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getByViaId" });
      }
    }
  };

  /**
   * @route GET /imagens/croqui/:id
   * @group Imagem - Operações relacionadas a imagens
   * @returns {Array.<Imagem>} 200 - Imagens encontradas
   * @returns {object} 404 - Imagens não encontradas
   * @returns {Error} 500 - Erro desconhecido
   */
  getByCroquiId = async (req: Request, res: Response) => {
    try {
      const croquiId = parseInt(req.params.id);
      const result = await this.service.getByCroquiId(croquiId);
      if (!result) {
        return res.status(404).json({ error: "Imagens não encontradas" });
      }
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getByCroquiId" });
      }
    }
  };

}

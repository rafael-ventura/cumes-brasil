import { ColecaoService } from '../../Application/services/ColecaoService';
import { Colecao } from '../../Domain/entities/Colecao';
import { Request, Response } from 'express';

export class ColecaoController {
    private service: ColecaoService;

    constructor (colecaoaService: ColecaoService) {
        this.service = colecaoaService;
    }

    /**
     * @route GET /colecaoes/:id
     * @group Colecaoes - Operações relacionadas a Colecaoes
     * @returns {Colecao.model} 200 - Colecao encontrada
     * @returns {object} 404 - Colecao não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const colecao = await this.service.getColecaoById(id);
            res.json(colecao);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Colecao não encontrada") {
                    return res.status(404).json({message: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller getById"});
            }
        }
    }

    /**
     * @route GET /colecaos
     * @group Colecaos - Operações relacionadas a Colecaos
     * @returns {Array.<Colecao>} 200 - Colecaos encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllColecao = async (_: Request, res: Response) => {
        try {
            const colecoes = await this.service.getAllColecoes();
            res.json(colecoes);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Nenhuma coleção encontrada") {
                    return res.status(404).json({message: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller getAllColecao"});
            }
        }
    };

    /**
     * @route GET /colecaos/colecoesDoUsuario/:usuarioId
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {object} 201 - Colecoes encontradas com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    getByUsuarioId = async (req: Request, res: Response) => {
        try {
            const usuarioId = Number(req.params.id);
            const colecoes = await this.service.getColecoesByUsuarioId(usuarioId);
            res.status(200).json(colecoes);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Nenhuma coleção encontrada") {
                    return res.status(404).json({message: error.message});
                } else if (error.message === "Usuário não informado") {
                    return res.status(400).json({error: error.message});
                } else if (error.message === "Usuário inválido") {
                    return res.status(400).json({error: error.message});
                } else {
                    res.status(500).json({error: "Ocorreu um erro desconhecido em controller getByUsuarioId"});
                }
            }
        }
    };


    /**
     * @route POST /colecaos
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {object} 201 - Colecao criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createColecao = async (req: Request, res: Response) => {
        try {
            const {
                nome,
                descricao,
                usuario_id,
                imagem_id
            } = req.body;
            const colecao = new Colecao();
            colecao.nome = nome;
            colecao.descricao = descricao;
            colecao.usuario = usuario_id;
            colecao.imagem = imagem_id || 1;

            await this.service.createColecao(colecao);
            res.status(201).json({ message: 'Colecao criada com sucesso.' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller createColecao' });
            }
        }
    };

    /**
     * @route PUT /colecoes
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateColecao = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const colecao: Colecao = req.body;
            await this.service.updateColecao(id, colecao);
            res.status(200).json({ message: "Colecao atualizada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Colecao não encontrada") {
                    return res.status(404).json({ message: error.message });
                }
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller update' });
            }
        }
    }

    /**
     * @route DELETE /colecoes/:id
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    deleteColecao = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteColecao(id);
            res.status(200).json({ message: "Coleção deletada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Coleção não encontrada") {
                    return res.status(404).json({ message: error.message });
                }
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller delete"});
            }
        }
    }

    /**
     * @route POST Via /colecoes/adicionarVia
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Via adicionada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    adicionarVia = async (req: Request, res: Response) => {
        try {
            const {
                colecao_id,
                via_id
            } = req.body;
            const colecaoId: number = colecao_id;
            const viaId: number = via_id;
            await this.service.addViaToColecao(viaId, colecaoId);
            res.status(201).json({ message: "Via adicionada à coleção com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Coleção não encontrada") {
                    return res.status(404).json({ message: error.message });
                } else if (error.message === "Via não encontrada") {
                    return res.status(404).json({ message: error.message });
                } else if (error.message === "A via já está presente nesta coleção.") {
                    return res.status(400).json({ message: error.message });
                } else {
                    res.status(500).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller adicionarVia" });
            }
        }
    }

    /**
     * @route DELETE Via /colecoes/:colecaoId/removeVia/:viaId
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Via removida com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     * @returns {object} 404 - Via não encontrada
     */
    removeVia = async (req: Request, res: Response) => {
        try {
            const colecaoId = parseInt(req.params.id);
            const viaId = parseInt(req.params.viaId);
            await this.service.removeViaFromColecao(viaId, colecaoId);
            res.status(200).json({ message: "Via removida da coleção com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Coleção não encontrada") {
                    return res.status(404).json({message: error.message});
                } else if (error.message === "Via não encontrada") {
                    return res.status(404).json({message: error.message});
                }
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller removeVia"});
            }
        }
    }

}

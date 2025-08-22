import {ColecaoService} from '../../Application/services/ColecaoService';
import {Colecao} from '../../Domain/entities/Colecao';
import {Request, Response} from 'express';
import {ColecaoDTO} from "../DTOs/Colecao/ColecaoDTO";

export class ColecaoController {
    private service: ColecaoService;

    constructor(colecaoaService: ColecaoService) {
        this.service = colecaoaService;
    }
    //TODO: USAR MIDDLEWARE DE ERRO. AJUSTAR CHAMADA DOS MÉTODOS ABAIXO. AJUSTAR TIPAGENS DE RETORNO. AJUSTAR SWAGGER. AJUSTAR NOMES DE MÉTODOS RESTFUL

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

            if (!colecao) {
                return res.status(404).json({message: "Coleção não encontrada"});
            }

            return res.json(new ColecaoDTO(colecao));
        } catch (error) {
            res.status(500).json({error: error instanceof Error ? error.message : "Erro desconhecido"});
        }
    };

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
            return res.json(colecoes.map(c => new ColecaoDTO(c)));
        } catch (error) {
            res.status(500).json({error: error instanceof Error ? error.message : "Erro desconhecido"});
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
                    res.status(500).json({error: "Ocorreu um erro desconhecido em controller obterPorUsuario"});
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
            const colecao: Colecao = req.body;
            await this.service.createColecao(colecao);
            res.status(201).json({message: 'Colecao criada com sucesso.'});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: 'Ocorreu um erro desconhecido em controller createColecao'});
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
            res.status(200).json({message: "Colecao atualizada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Colecao não encontrada") {
                    return res.status(404).json({message: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: 'Ocorreu um erro desconhecido em controller atualizar'});
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
            res.status(200).json({message: "Coleção deletada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Coleção não encontrada") {
                    return res.status(404).json({message: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller excluir"});
            }
        }
    }

    /**
     * @route GET /colecoes/not-containing-via/:viaId
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {Array.<Colecao>} 200 - Colecoes encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getColecoesNotContainingViaForUser = async (req: Request, res: Response) => {
        try {
            const viaId = Number(req.params.viaId);
            const usuarioId = Number(req.query.usuarioId);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await this.service.getColecoesNotContainingViaForUser(
                viaId,
                usuarioId,
                page,
                limit
            );

            res.status(200).json(result);
        } catch (error) {
            console.error('Erro no getColecoesNotContainingViaForUser:', error);
            res.status(500).json({error: 'Erro interno no servidor.'});
        }
    };

    /**
     * @route POST Via /colecoes/adicionarVia
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Via adicionada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    adicionarVia = async (req: Request, res: Response) => {
        try {
            const colecaoId = parseInt(req.query.colecao_id as string);
            const viaId = parseInt(req.query.via_id as string);
            await this.service.addViaToColecao(viaId, colecaoId);
            res.status(201).json({message: "Via adicionada à coleção com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Coleção não encontrada") {
                    return res.status(404).json({message: error.message});
                } else if (error.message === "Via não encontrada") {
                    return res.status(404).json({message: error.message});
                } else if (error.message === "A via já está presente nesta coleção.") {
                    return res.status(400).json({message: error.message});
                } else {
                    res.status(500).json({error: error.message});
                }
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller adicionarVia"});
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
            const colecaoId = parseInt(req.query.colecao_id as string);
            const viaId = parseInt(req.query.via_id as string);
            await this.service.removeViaFromColecao(viaId, colecaoId);
            res.status(200).json({message: "Via removida da coleção com sucesso."});
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

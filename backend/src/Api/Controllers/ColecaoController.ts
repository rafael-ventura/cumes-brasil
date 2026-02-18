import {ColecaoService} from '../../Application/services/ColecaoService';
import {Colecao} from '../../Domain/entities/Colecao';
import {Request, Response} from 'express';
import {ColecaoDTO} from "../DTOs/Colecao/ColecaoDTO";
import { NotFoundError } from '../../Application/errors';
import ColecaoValidation from '../../Application/validations/ColecaoValidation';
import { Service } from 'typedi';

@Service()
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
        const id = ColecaoValidation.idParam(req.params.id);
        const colecao = await this.service.getColecaoById(id);

        if (!colecao) {
            throw new NotFoundError("Coleção não encontrada");
        }

        return res.json(new ColecaoDTO(colecao));
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
        const colecoes = await this.service.getAllColecoes();
        return res.json(colecoes.map(c => new ColecaoDTO(c)));
    };

    /**
     * @route GET /colecaos/colecoesDoUsuario/:usuarioId
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {object} 201 - Colecoes encontradas com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    getByUsuarioId = async (req: Request, res: Response) => {
        const usuarioId = ColecaoValidation.idParam(req.params.id);
        const colecoes = await this.service.getColecoesByUsuarioId(usuarioId);
        res.status(200).json(colecoes);
    };


    /**
     * @route POST /colecaos
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {object} 201 - Colecao criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createColecao = async (req: Request, res: Response) => {
        const colecao: Colecao = req.body;
        ColecaoValidation.createBody(colecao);
        await this.service.createColecao(colecao);
        res.status(201).json({message: 'Colecao criada com sucesso.'});
    };

    /**
     * @route PUT /colecoes
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateColecao = async (req: Request, res: Response) => {
        const id = ColecaoValidation.idParam(req.params.id);
        const colecao: Colecao = req.body;
        ColecaoValidation.updateBody(colecao);
        await this.service.updateColecao(id, colecao);
        res.status(200).json({message: "Colecao atualizada com sucesso."});
    }

    /**
     * @route DELETE /colecoes/:id
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    deleteColecao = async (req: Request, res: Response) => {
        const id = ColecaoValidation.idParam(req.params.id);
        await this.service.deleteColecao(id);
        res.status(200).json({message: "Coleção deletada com sucesso."});
    }

    /**
     * @route GET /colecoes/not-containing-via/:viaId
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {Array.<Colecao>} 200 - Colecoes encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getColecoesNotContainingViaForUser = async (req: Request, res: Response) => {
        const viaId = ColecaoValidation.idParam(req.params.viaId);
        const usuarioId = ColecaoValidation.usuarioIdQuery(req.query.usuarioId, true) as number;
        const { page = 1, limit = 10 } = ColecaoValidation.pagination(req.query.page, req.query.limit);
        const result = await this.service.getColecoesNotContainingViaForUser(
            viaId,
            usuarioId,
            page,
            limit
        );

        res.status(200).json(result);
    };

    /**
     * @route POST Via /colecoes/adicionarVia
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Via adicionada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    adicionarVia = async (req: Request, res: Response) => {
        const colecaoId = ColecaoValidation.colecaoIdQuery(req.query.colecao_id);
        const viaId = ColecaoValidation.viaIdQuery(req.query.via_id);
        await this.service.addViaToColecao(viaId, colecaoId);
        res.status(201).json({message: "Via adicionada à coleção com sucesso."});
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
        const colecaoId = ColecaoValidation.colecaoIdQuery(req.query.colecao_id);
        const viaId = ColecaoValidation.viaIdQuery(req.query.via_id);
        await this.service.removeViaFromColecao(viaId, colecaoId);
        res.status(200).json({message: "Via removida da coleção com sucesso."});
    }

}

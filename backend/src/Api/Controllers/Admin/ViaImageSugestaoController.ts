import { Request, Response } from 'express';
import { ViaImageSugestaoService } from '../../../Application/services/ViaImageSugestaoService';
import { ImagemRepository } from '../../../Infrastructure/repositories/ImagemRepository';
import { obterUsuarioIdAutenticado } from '../../utils/usuarioRequisicao';

const service = new ViaImageSugestaoService();
const imagemRepo = new ImagemRepository();

export class ViaImageSugestaoController {
  submeter = async (req: Request, res: Response) => {
    const viaId = Number(req.params.viaId);
    const usuarioId = obterUsuarioIdAutenticado(req);
    const { creditos } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    // Em dev: arquivo salvo pelo multer em assets/vias/; em produção: enviar ao S3
    const imageUrl = process.env.CLOUDFRONT_URL
      ? `/assets/vias/${file.filename}` // placeholder — substituir por S3Helper ao reativar AWS
      : `/assets/vias/${file.filename}`;

    const imagem = await imagemRepo.createNew({
      url: imageUrl,
      tipo_entidade: 'via',
      descricao: `Sugestão de foto para via ${viaId}`
    });

    const sugestao = await service.submeter(viaId, imagem.id, usuarioId, creditos);
    return res.status(201).json(sugestao);
  };

  listarPendentes = async (_req: Request, res: Response) => {
    const sugestoes = await service.listarPendentes();
    return res.json(sugestoes);
  };

  listarTodas = async (_req: Request, res: Response) => {
    const sugestoes = await service.listarTodas();
    return res.json(sugestoes);
  };

  listarAprovadaPorVia = async (req: Request, res: Response) => {
    const viaId = Number(req.params.viaId);
    const sugestoes = await service.listarAprovadaPorVia(viaId);
    return res.json(sugestoes);
  };

  aprovar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const adminId = obterUsuarioIdAutenticado(req);
    const sugestao = await service.aprovar(id, adminId);
    return res.json(sugestao);
  };

  rejeitar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const adminId = obterUsuarioIdAutenticado(req);
    const { motivo } = req.body;
    const sugestao = await service.rejeitar(id, adminId, motivo);
    return res.json(sugestao);
  };
}

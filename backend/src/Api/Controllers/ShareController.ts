import { Request, Response } from 'express';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { buildImageUrl } from '../../Infrastructure/helpers/imageHelper';
import { ImagemDTO } from '../DTOs/Imagem/ImagemDTO';

class ShareController {
  private usuarioRepo: UsuarioRepository;
  private viaRepo: ViaRepository;
  private escaladaRepo: EscaladaRepository;

  constructor () {
    this.usuarioRepo = new UsuarioRepository();
    this.viaRepo = new ViaRepository();
    this.escaladaRepo = new EscaladaRepository();
  }

  private obterUrlBase (req: Request): string {
    const protocol =
      (req.headers['x-forwarded-proto'] as string | undefined) ||
      (req.protocol ? req.protocol : 'http');
    const host = req.get('host');
    return `${protocol}://${host}`;
  }

  private renderizarPaginaHtml (params: {
    title: string;
    description: string;
    imageUrl?: string | null;
    canonicalUrl: string;
    redirectUrl: string;
  }) {
    const image = params.imageUrl || '/logo.png';
    const urlRedirecionamento = params.redirectUrl;

    // meta tags são a parte mais importante para preview (WhatsApp/Facebook).
    // O redirect serve apenas para o usuário ao clicar após visualizar o card.
    return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${this.escaparHtml(params.title)}</title>

  <meta property="og:title" content="${this.escaparHtml(params.title)}" />
  <meta property="og:description" content="${this.escaparHtml(params.description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${params.canonicalUrl}" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${this.escaparHtml(params.title)}" />
  <meta name="twitter:description" content="${this.escaparHtml(params.description)}" />
  <meta name="twitter:image" content="${image}" />

  <meta http-equiv="refresh" content="0; url=${urlRedirecionamento}" />
</head>
<body>
  <noscript>
    <meta http-equiv="refresh" content="0; url=${urlRedirecionamento}" />
  </noscript>
  <a href="${urlRedirecionamento}">Abrir no Cumes Brasil</a>
</body>
</html>`;
  }

  private escaparHtml (s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  obterPaginaCompartilhamentoPerfil = async (req: Request, res: Response) => {
    const username = String(req.params.username || '').trim().toLowerCase();
    if (!username) return res.status(400).send('Username inválido');

    const base = this.obterUrlBase(req);
    const canonicalUrl = `${base}/perfil/${username}`;
    const redirectUrl = canonicalUrl;

    const perfil = await this.usuarioRepo.getPerfilPublicoPorUsername(username);
    if (!perfil) return res.status(404).send('Perfil não encontrado');
    if (perfil.perfil_publico === false) return res.status(404).send('Perfil indisponível');

    const img = perfil.foto_perfil ? new ImagemDTO(perfil.foto_perfil as any).url : '/logo.png';
    const title = `${perfil.nome || '@' + username} no Cumes Brasil`;
    const description = `Perfil de @${username} no catálogo de escalada.`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      this.renderizarPaginaHtml({
        title,
        description,
        imageUrl: img,
        canonicalUrl,
        redirectUrl
      })
    );
  };

  obterPaginaCompartilhamentoVia = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) return res.status(400).send('ID inválido');

    const base = this.obterUrlBase(req);
    const canonicalUrl = `${base}/vias/${id}`;
    const redirectUrl = canonicalUrl;

    const via = await this.viaRepo.getById(id);
    if (!via) return res.status(404).send('Via não encontrada');

    const viaImagens = Array.isArray(via.viaImagens) ? via.viaImagens : [];
    const primeiraImagem = viaImagens.find((vi: any) => vi?.imagem?.url);
    const imageUrl = primeiraImagem?.imagem?.url
      ? buildImageUrl(primeiraImagem.imagem.url)
      : null;

    const title = via.nome || 'Via no Cumes Brasil';
    const description = 'Veja a via no catálogo de escalada.';

    res.setHeader('Content-Type', 'text/html; charset-utf-8');
    res.status(200).send(
      this.renderizarPaginaHtml({
        title,
        description,
        imageUrl,
        canonicalUrl,
        redirectUrl
      })
    );
  };

  obterPaginaCompartilhamentoEscalada = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) return res.status(400).send('ID inválido');

    const base = this.obterUrlBase(req);
    const canonicalUrl = `${base}/escaladas/${id}`;
    const redirectUrl = canonicalUrl;

    const escalada = await this.escaladaRepo.getById(id);
    if (!escalada) return res.status(404).send('Escalada não encontrada');

    // Privacidade segue o contrato de exibição da escalada:
    // se o autor não é público e não é o dono, não pode abrir.
    // Como aqui é compartilhamento público, mantemos restrição.
    if (escalada.usuario && !escalada.usuario.perfil_publico) {
      return res.status(404).send('Escalada indisponível');
    }

    const via = escalada.via as any;
    const viaImagens = via?.viaImagens && Array.isArray(via.viaImagens) ? via.viaImagens : [];
    const primeiraImagem = viaImagens.find((vi: any) => vi?.imagem?.url);
    const imageUrl = primeiraImagem?.imagem?.url
      ? buildImageUrl(primeiraImagem.imagem.url)
      : null;

    const viaNome = via?.nome || 'Via no Cumes Brasil';
    const autor = escalada.usuario?.nome || escalada.usuario?.username || 'um escalador';

    const title = `${viaNome} • registro de ${autor}`;
    const description = 'Veja o registro da escalada e detalhes da via.';

    res.setHeader('Content-Type', 'text/html; charset-utf-8');
    res.status(200).send(
      this.renderizarPaginaHtml({
        title,
        description,
        imageUrl,
        canonicalUrl,
        redirectUrl
      })
    );
  };
}

export default ShareController;


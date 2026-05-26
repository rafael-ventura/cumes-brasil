import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import NotFoundError from '../errors/NotFoundError';
import { UsuarioConquistaRepository } from '../../Infrastructure/repositories/UsuarioConquistaRepository';

export type ConquistaTier = 'NENHUM' | 'BRONZE' | 'PRATA' | 'OURO' | 'PLATINA';

export type ConquistaTipoId =
  | 'vias_escaladas'
  | 'bairros_diferentes'
  | 'graus_diferentes'
  | 'km_vias';

export type ConquistaBadge = {
  tier: ConquistaTier;
  icone: string;
  label: string;
  cor: string;
};

export type ProgressoConquista = {
  atual: number;
  proximo: number | null;
};

export type ConquistasPorTipo = {
  id: ConquistaTipoId;
  tipo: string;
  titulo: string;
  descricao?: string;
  iconeTipo: string;
  badge: ConquistaBadge;
  progresso: ProgressoConquista;
  valorAtual: number;
};

export type ConquistasResposta = {
  conquistas: ConquistasPorTipo[];
};

const TIER_CONFIG: Record<ConquistaTier, { label: string; icone: string; cor: string; ordem: number }> = {
  NENHUM: { label: 'Nenhum', icone: 'lock', cor: '#6b7280', ordem: 0 },
  BRONZE: { label: 'Bronze', icone: 'emoji_events', cor: '#CD7F32', ordem: 1 },
  PRATA: { label: 'Prata', icone: 'emoji_events', cor: '#C0C0C0', ordem: 2 },
  OURO: { label: 'Ouro', icone: 'emoji_events', cor: '#D4AF37', ordem: 3 },
  PLATINA: { label: 'Platina', icone: 'emoji_events', cor: '#7DF9FF', ordem: 4 }
};

function calcularBadgePorValor (valor: number, limiaresAsc: Array<{ tier: ConquistaTier; min: number }>): { badge: ConquistaBadge; progresso: ProgressoConquista } {
  const valorNumero = Number.isFinite(valor) ? valor : 0;

  let tierAtual: ConquistaTier = 'NENHUM';
  for (const { tier, min } of limiaresAsc) {
    if (valorNumero >= min) tierAtual = tier;
  }

  // Próximo: menor limiar que ainda não foi atingido (exceto NENHUM).
  let proximo: number | null = null;
  for (const { min, tier } of limiaresAsc) {
    if (tier === 'NENHUM') continue;
    if (valorNumero < min) {
      proximo = min;
      break;
    }
  }

  const config = TIER_CONFIG[tierAtual];
  return {
    badge: {
      tier: tierAtual,
      icone: config.icone,
      label: config.label,
      cor: config.cor
    },
    progresso: { atual: valorNumero, proximo }
  };
}

function montarConquistaTipo (params: {
  id: ConquistaTipoId;
  tipo: string;
  titulo: string;
  descricao: string;
  iconeTipo: string;
  valorAtual: number;
  limiaresAsc: Array<{ tier: ConquistaTier; min: number }>;
}): ConquistasPorTipo {
  const { badge, progresso } = calcularBadgePorValor(params.valorAtual, params.limiaresAsc);
  return {
    id: params.id,
    tipo: params.tipo,
    titulo: params.titulo,
    descricao: params.descricao,
    iconeTipo: params.iconeTipo,
    badge: {
      tier: badge.tier,
      icone: badge.icone,
      label: badge.label,
      cor: badge.cor
    },
    progresso,
    valorAtual: params.valorAtual
  };
}

export class ConquistasService {
  constructor(
    private usuarioRepo: UsuarioRepository,
    private escaladaRepo: EscaladaRepository,
    private usuarioConquistaRepo: UsuarioConquistaRepository
  ) {}

  async obterConquistasMe (usuarioIdAtual: number): Promise<ConquistasResposta> {
    const usuario = await this.usuarioRepo.getPerfilSemHash(usuarioIdAtual);
    if (!usuario) throw new NotFoundError('Usuário não encontrado');

    const conquistas = await this.atualizarEObterConquistasParaUsuario(usuario.id);
    return { conquistas };
  }

  async obterConquistasPorUsername (
    username: string,
    usuarioIdAtual?: number | null
  ): Promise<ConquistasResposta | null> {
    const usuarioAlvo = await this.usuarioRepo.findByUsername(username);
    if (!usuarioAlvo) throw new NotFoundError('Usuário não encontrado');

    const ehMeuPerfil = usuarioIdAtual != null && usuarioAlvo.id === usuarioIdAtual;
    if (!ehMeuPerfil && !usuarioAlvo.perfil_publico) {
      return null;
    }

    if (!ehMeuPerfil && usuarioAlvo.conquistas_publico === false) {
      return null;
    }

    const conquistas = await this.atualizarEObterConquistasParaUsuario(usuarioAlvo.id);

    return { conquistas };
  }

  private async atualizarEObterConquistasParaUsuario (
    usuarioId: number
  ): Promise<ConquistasPorTipo[]> {
    const viasEscaladas = await this.escaladaRepo.contarViasEscaladasPorUsuario(usuarioId);
    const bairrosDiferentes = await this.escaladaRepo.contarBairrosDiferentesPorUsuario(usuarioId);
    const grausDiferentes = await this.escaladaRepo.contarGrausDiferentesPorUsuario(usuarioId);
    const extensaoMetros = Math.round(await this.escaladaRepo.somarExtensaoViasPorUsuario(usuarioId));

    // Limiar por tier (ascendente) — valores simples, só para mock inicial.
    const limiaresViasEscaladas = [
      { tier: 'NENHUM' as const, min: 0 },
      { tier: 'BRONZE' as const, min: 1 },
      { tier: 'PRATA' as const, min: 5 },
      { tier: 'OURO' as const, min: 15 },
      { tier: 'PLATINA' as const, min: 30 }
    ];

    const limiaresBairrosDiferentes = [
      { tier: 'NENHUM' as const, min: 0 },
      { tier: 'BRONZE' as const, min: 1 },
      { tier: 'PRATA' as const, min: 3 },
      { tier: 'OURO' as const, min: 7 },
      { tier: 'PLATINA' as const, min: 15 }
    ];

    const limiaresGrausDiferentes = [
      { tier: 'NENHUM' as const, min: 0 },
      { tier: 'BRONZE' as const, min: 1 },
      { tier: 'PRATA' as const, min: 5 },
      { tier: 'OURO' as const, min: 10 },
      { tier: 'PLATINA' as const, min: 20 }
    ];

    const limiaresKmVias = [
      { tier: 'NENHUM' as const, min: 0 },
      { tier: 'BRONZE' as const, min: 250 },
      { tier: 'PRATA' as const, min: 500 },
      { tier: 'OURO' as const, min: 1000 },
      { tier: 'PLATINA' as const, min: 2000 }
    ];

    const conquistas = [
      montarConquistaTipo({
        id: 'vias_escaladas',
        tipo: 'Vias escaladas',
        titulo: 'Vias Escaladas',
        descricao: 'Quantas vias diferentes você escalou (como autor).',
        iconeTipo: 'hiking',
        valorAtual: viasEscaladas,
        limiaresAsc: limiaresViasEscaladas
      }),
      montarConquistaTipo({
        id: 'bairros_diferentes',
        tipo: 'Bairros diferentes',
        titulo: 'Bairros Diferentes',
        descricao: 'Quantos bairros diferentes você visitou escalando.',
        iconeTipo: 'place',
        valorAtual: bairrosDiferentes,
        limiaresAsc: limiaresBairrosDiferentes
      }),
      montarConquistaTipo({
        id: 'graus_diferentes',
        tipo: 'Graus diferentes',
        titulo: 'Graus Diferentes',
        descricao: 'Quantos graus diferentes você escalou (como autor).',
        iconeTipo: 'terrain',
        valorAtual: grausDiferentes,
        limiaresAsc: limiaresGrausDiferentes
      }),
      montarConquistaTipo({
        id: 'km_vias',
        tipo: 'Km de vias',
        titulo: 'Km de Vias',
        descricao: 'Extensão total (em metros) somada das vias escaladas (como autor).',
        iconeTipo: 'route',
        valorAtual: extensaoMetros,
        limiaresAsc: limiaresKmVias
      })
    ];

    await Promise.all(
      conquistas.map(c =>
        this.usuarioConquistaRepo.upsertUsuarioConquista({
          usuarioId,
          tipo: c.id,
          valorAtual: c.valorAtual,
          tier: c.badge.tier
        })
      )
    );

    return conquistas;
  }
}


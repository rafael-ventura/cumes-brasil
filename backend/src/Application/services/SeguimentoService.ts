import { Usuario } from '../../Domain/entities/Usuario';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { UsuarioSeguindoRepository } from '../../Infrastructure/repositories/UsuarioSeguindoRepository';

export type EstatisticasSeguimento = {
  num_seguindo: number;
  num_seguidores: number;
  is_seguindo: boolean | null;
};

export type UsuarioResumoSeguimento = {
  id: number;
  nome: string;
  username: string;
  perfil_publico: boolean;
  foto_perfil_url: string | null;
};

export class SeguimentoService {
  constructor(
    private usuarioRepo: UsuarioRepository,
    private usuarioSeguindoRepo: UsuarioSeguindoRepository
  ) {}

  async obterEstatisticasMe (usuarioIdAtual: number): Promise<EstatisticasSeguimento> {
    const num_seguindo = await this.usuarioSeguindoRepo.contarSeguindo(usuarioIdAtual);
    const num_seguidores = await this.usuarioSeguindoRepo.contarSeguidores(usuarioIdAtual);

    return { num_seguindo, num_seguidores, is_seguindo: null };
  }

  async obterEstatisticasPorUsername (
    username: string,
    usuarioIdAtual?: number | null
  ): Promise<EstatisticasSeguimento | null> {
    const usuarioAlvo = await this.usuarioRepo.findByUsername(username);
    if (!usuarioAlvo) return null;

    const num_seguindo = await this.usuarioSeguindoRepo.contarSeguindo(usuarioAlvo.id);
    const num_seguidores = await this.usuarioSeguindoRepo.contarSeguidores(usuarioAlvo.id);

    if (!usuarioIdAtual) {
      return { num_seguindo, num_seguidores, is_seguindo: null };
    }

    const is_seguindo = usuarioIdAtual === usuarioAlvo.id
      ? false
      : await this.usuarioSeguindoRepo.existeSeguindo(usuarioIdAtual, usuarioAlvo.id);

    return { num_seguindo, num_seguidores, is_seguindo };
  }

  async seguirUsuario (seguidorId: number, seguidoUsername: string): Promise<void> {
    const usuarioAlvo = await this.usuarioRepo.findByUsername(seguidoUsername);
    if (!usuarioAlvo) {
      throw new Error('Usuário a ser seguido não encontrado');
    }

    if (usuarioAlvo.id === seguidorId) return; // evita seguir a si mesmo

    const jaSegue = await this.usuarioSeguindoRepo.existeSeguindo(seguidorId, usuarioAlvo.id);
    if (jaSegue) return;

    await this.usuarioSeguindoRepo.create({
      seguidor: { id: seguidorId } as unknown as Usuario,
      seguido: { id: usuarioAlvo.id } as unknown as Usuario
    });
  }

  async deixarDeSeguirUsuario (seguidorId: number, seguidoUsername: string): Promise<void> {
    const usuarioAlvo = await this.usuarioRepo.findByUsername(seguidoUsername);
    if (!usuarioAlvo) {
      throw new Error('Usuário a ser seguido não encontrado');
    }

    if (usuarioAlvo.id === seguidorId) return;

    await this.usuarioSeguindoRepo.removerSeguindo(seguidorId, usuarioAlvo.id);
  }

  async listarSeguindoMe (usuarioIdAtual: number): Promise<UsuarioResumoSeguimento[]> {
    const lista = await this.usuarioSeguindoRepo.listarQuemEuSigo(usuarioIdAtual);
    return lista.map(u => ({
      ...u,
      foto_perfil_url: u.foto_url
    }));
  }

  async listarSeguidoresMe (usuarioIdAtual: number): Promise<UsuarioResumoSeguimento[]> {
    const lista = await this.usuarioSeguindoRepo.listarQuemMeSegue(usuarioIdAtual);
    return lista.map(u => ({
      ...u,
      foto_perfil_url: u.foto_url
    }));
  }
}


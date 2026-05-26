import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';

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

class SeguimentoService {
  async obterEstatisticasMe (): Promise<EstatisticasSeguimento | null> {
    try {
      const response = await api.get('/seguimentos/estatisticas/me');
      return response.data as EstatisticasSeguimento;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar estatísticas de seguimento');
      return null;
    }
  }

  async obterEstatisticasPorUsername (username: string): Promise<EstatisticasSeguimento | null> {
    try {
      const response = await api.get(`/seguimentos/estatisticas/${username}`);
      return response.data as EstatisticasSeguimento;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar estatísticas de seguimento');
      return null;
    }
  }

  async seguir (username: string): Promise<void> {
    try {
      await api.post(`/seguimentos/seguir/${username}`);
    } catch (error: any) {
      handleApiError(error, 'Erro ao seguir usuário');
    }
  }

  async deixarDeSeguir (username: string): Promise<void> {
    try {
      await api.delete(`/seguimentos/seguir/${username}`);
    } catch (error: any) {
      handleApiError(error, 'Erro ao deixar de seguir usuário');
    }
  }

  async listarSeguindoMe (): Promise<UsuarioResumoSeguimento[] | null> {
    try {
      const response = await api.get('/seguimentos/seguindo/me');
      return (response.data?.usuarios ?? []) as UsuarioResumoSeguimento[];
    } catch (error: any) {
      handleApiError(error, 'Erro ao listar quem você segue');
      return null;
    }
  }

  async listarSeguidoresMe (): Promise<UsuarioResumoSeguimento[] | null> {
    try {
      const response = await api.get('/seguimentos/seguidores/me');
      return (response.data?.usuarios ?? []) as UsuarioResumoSeguimento[];
    } catch (error: any) {
      handleApiError(error, 'Erro ao listar quem te segue');
      return null;
    }
  }
}

export default new SeguimentoService();


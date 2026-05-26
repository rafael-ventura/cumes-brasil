import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';
import type { ConquistasResposta } from 'src/models/IConquistas';

class ConquistasService {
  async obterConquistasMe (): Promise<ConquistasResposta | null> {
    try {
      const response = await api.get('/conquistas/me');
      return response.data as ConquistasResposta;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar conquistas do perfil');
      return null;
    }
  }

  async obterConquistasPorUsername (username: string): Promise<ConquistasResposta | null> {
    try {
      const response = await api.get(`/conquistas/usuario/${username}`);
      return response.data as ConquistasResposta;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar conquistas por username');
      return null;
    }
  }
}

export default new ConquistasService();


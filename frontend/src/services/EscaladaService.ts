import { api } from 'boot/axios';
import { Escalada } from 'src/models/Escalada';
import { handleApiError } from 'src/utils/utils';

class EscaladaService {
  async createEscalada (escalada: Escalada): Promise<void> {
    try {
      await api.post('/escaladas/', escalada);
    } catch (error: any) {
      handleApiError(error, 'Erro ao criar escalada');
    }
  }

  async getEscaladasByUsuario (): Promise<Escalada[]> {
    try {
      const usuario = localStorage.getItem('usuarioId');
      const response = await api.get('/escaladas/usuario?usuario=' + usuario);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar escaladas');
      return [];
    }
  }

  async obterPorId (id: number): Promise<any> {
    const response = await api.get(`/escaladas/${id}`);
    return response.data;
  }

  async obterFeed (pagina: number, itensPorPagina: number): Promise<{ items: Escalada[]; totalPages: number; totalItems: number }> {
    const response = await api.get('/escaladas/feed', {
      params: { pagina, itensPorPagina }
    });
    return response.data;
  }
}

export default new EscaladaService();

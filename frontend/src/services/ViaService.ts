import { Via } from 'src/models/Via';
import { api } from 'boot/axios';
import { CroquiService } from 'src/services/CroquiService';
import { formatVia } from 'src/utils/utils';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';

class ViaService {
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      const via = response.data as Via;
      const croquiService = new CroquiService();
      via.croquis = await croquiService.getCroquiByViaId(via.id);
      return formatVia(via);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar via');
    }
  }

  async getAllVias (page?: number, limit?: number): Promise<{ vias: Via[], total: number }> {
    try {
      const params: any = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;

      const response = await api.get('/vias/', { params });
      const vias = response.data.vias as Via[];
      const total = response.data.total as number;

      return {
        vias: vias.map(formatVia),
        total
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar vias');
    }
  }

  async searchVias (query: string, filters?: any): Promise<{ vias: Via[], total: number }> {
    try {
      const response = await api.get('/vias/search', { params: { name: query, ...filters } });
      const vias = response.data.vias as Via[];
      const total = response.data.total as number;

      return {
        vias: vias.map(formatVia),
        total
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar vias');
    }
  }

  async addToFavorites (viaId: number): Promise<void> {
    if (!AuthenticateService.isAuthenticated()) {
      throw new Error('Usuario não autenticado');
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuario não encontrado');
    }

    const colecoes = await ColecaoService.getByUsuarioId();
    const favoritosColecao = colecoes.find(colecao => colecao.nome === 'Vias Favoritas');

    if (!favoritosColecao) {
      throw new Error('Coleção de favoritos não encontrada');
    }

    await ColecaoService.addViaToColecao(favoritosColecao.id, viaId);
  }
}

export default new ViaService();

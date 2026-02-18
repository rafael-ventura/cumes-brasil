import { api } from 'boot/axios';
import searchService from 'src/services/SearchService';
import { Via } from 'src/models/Via';

export interface IStats {
  vias: number;
  montanhas: number;
  usuarios: number;
}

class HomeService {
  async getCount (filter: string): Promise<number> {
    try {
      const encoded = encodeURIComponent(filter);
      const response = await api.get(`/vias/count/${encoded}`);
      return response.data.total;
    } catch (error: any) {
      console.error(`Erro ao obter contagem para o filtro ${filter}:`, error);
      return 0;
    }
  }

  async getCerjVias (limit = 6): Promise<Via[]> {
    try {
      const result = await searchService.search({
        entityType: 'via',
        via_cerj: true,
        page: 1,
        itemsPerPage: limit
      });
      return (result.items || []) as Via[];
    } catch (error: any) {
      console.error('Erro ao buscar vias CERJ:', error);
      return [];
    }
  }

  async getStats(): Promise<IStats> {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        vias: 0,
        montanhas: 0,
        usuarios: 0
      };
    }
  }
}

export default new HomeService();

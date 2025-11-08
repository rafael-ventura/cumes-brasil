import { api } from 'boot/axios';

export interface IStats {
  vias: number;
  montanhas: number;
  usuarios: number;
}

class HomeService {
  async getCount (filter: string): Promise<number> {
    try {
      const response = await api.get(`/vias/count/${filter}`);
      return response.data.total;
    } catch (error: any) {
      console.error(`Erro ao obter contagem para o filtro ${filter}:`, error);
      return 0;
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

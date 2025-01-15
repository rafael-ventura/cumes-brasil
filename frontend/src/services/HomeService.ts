import { api } from 'boot/axios';

class HomeService {
  async getCount (filter: string): Promise<number> {
    try {
      const response = await api.get(`/vias/count/${filter}`);
      return response.data.total; // Assume que o endpoint retorna um objeto com { total: number }
    } catch (error: any) {
      console.error(`Erro ao obter contagem para o filtro ${filter}:`, error);
      return 0; // Retorna 0 em caso de erro para evitar quebra
    }
  }
}

export default new HomeService();

import { api } from 'boot/axios';

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

  async getTotalMontanhas(): Promise<number> {
    try {
      const response = await api.get('/montanhas');
      return response.data.length;
    } catch (error: any) {
      console.error('Erro ao obter total de montanhas:', error);
      return 0;
    }
  }

  async getTotalUsuarios(): Promise<number> {
    try {
      const response = await api.get('/usuarios');
      return response.data.length;
    } catch (error: any) {
      console.error('Erro ao obter total de usuários:', error);
      return 0;
    }
  }
}

export default new HomeService();

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

  async getEscaladas (): Promise<Escalada[]> {
    try {
      console.log('getEscaladas');
      const response = await api.get('/escaladas');
      console.log('fez a request');
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar escaladas');
      return [];
    }
  }
}

export default new EscaladaService();

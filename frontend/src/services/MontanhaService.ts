import { api } from 'boot/axios';
import { Montanha } from 'src/models/Montanha';

export class MontanhaService {
  async getById (id: number | string) {
    try {
      const response = await api.get(`/montanhas/${id}`);
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar montanha');
    }
  }

  async getAll (): Promise<Montanha[]> {
    try {
      const response = await api.get('/montanhas');
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar montanha');
    }
  }

  async getAllName (): Promise<string[]> {
    try {
      console.log('requiesting all Montanha names');
      const response = await api.get('/montanhas');
      return response.data.map((montanha: Montanha) => montanha.nome);
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar montanha');
    }
  }
}

export default new MontanhaService();

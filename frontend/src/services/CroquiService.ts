import { api } from 'boot/axios';
import { Croqui } from 'src/models/Croqui';

export class CroquiService {
  async getCroquiById (id: number | string): Promise<Croqui> {
    try {
      const response = await api.get(`/croquis/${id}`);
      return response.data as Croqui;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croqui');
    }
  }

  async getAllCroquis (): Promise<Croqui[]> {
    try {
      const response = await api.get('/croquis/');
      return response.data as Croqui[];
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croquis');
    }
  }

  async getCroquiByViaId (viaId: number | string): Promise<Croqui[]> {
    try {
      const response = await api.get(`/croquis/via/${viaId}`);
      return response.data as Croqui[];
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croquis');
    }
  }
}

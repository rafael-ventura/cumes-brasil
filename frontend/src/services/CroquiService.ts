import { api } from 'boot/axios';
import { Croqui } from 'src/models/Croqui';
import { adjustImageUrls, handleApiError } from 'src/utils/utils';

export class CroquiService {
  async getCroquiById (id: number | string): Promise<Croqui> {
    return this.fetchCroqui(`/croquis/${id}`);
  }

  async getAllCroquis (): Promise<Croqui[]> {
    return this.fetchCroquisCollection('/croquis/');
  }

  async getCroquiByViaId (viaId: number | string): Promise<Croqui[]> {
    return this.fetchCroquisCollection(`/croquis/via/${viaId}`);
  }

  private async fetchCroqui (url: string): Promise<Croqui> {
    try {
      const response = await api.get(url);
      const croqui = response.data as Croqui;

      adjustImageUrls(croqui);
      return croqui;
    } catch (error: any) {
      handleApiError(error, 'Erro desconhecido ao buscar croqui');
    }
  }

  private async fetchCroquisCollection (url: string): Promise<Croqui[]> {
    try {
      const response = await api.get(url);
      const croquis = response.data as Croqui[];

      croquis.forEach(adjustImageUrls);
      return croquis;
    } catch (error: any) {
      handleApiError(error, 'Erro desconhecido ao buscar croquis');
    }
  }
}

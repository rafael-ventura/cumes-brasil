import { api } from 'boot/axios';
import { Croqui } from 'src/models/Croqui';
import { getFullImageUrl } from 'src/services/ImagemService';

export class CroquiService {
  async getCroquiById (id: number | string): Promise<Croqui> {
    try {
      const response = await api.get(`/croquis/${id}`);
      const croqui = response.data as Croqui;

      if (croqui.imagem?.url) {
        croqui.imagem.url = getFullImageUrl(croqui.imagem.url);
      }
      return croqui;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croqui');
    }
  }

  async getAllCroquis (): Promise<Croqui[]> {
    try {
      const response = await api.get('/croquis/');
      const croquis = response.data as Croqui[];

      for (const croqui of croquis) {
        if (croqui.imagem?.url) {
          croqui.imagem.url = getFullImageUrl(croqui.imagem.url);
        }
      }
      return croquis;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croquis');
    }
  }

  async getCroquiByViaId (viaId: number | string): Promise<Croqui[]> {
    try {
      const response = await api.get(`/croquis/via/${viaId}`);
      const croquis = response.data as Croqui[];

      for (const croqui of croquis) {
        if (croqui.imagem?.url) {
          croqui.imagem.url = getFullImageUrl(croqui.imagem.url);
        }
      }
      return croquis;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar croquis');
    }
  }
}

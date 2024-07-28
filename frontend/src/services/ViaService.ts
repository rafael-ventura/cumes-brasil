import { Via } from 'src/models/Via';
import { api } from 'boot/axios';
import { CroquiService } from 'src/services/CroquiService';
import { adjustImageUrl } from 'src/services/ImagemService';

class ViaService {
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      const via = response.data as Via;
      const croquiService = new CroquiService();
      const croquis = await croquiService.getCroquiByViaId(via.id);
      via.croquis = croquis.map(croqui => {
        if (croqui.imagem?.url) {
          croqui.imagem.url = adjustImageUrl(croqui.imagem.url);
        }
        return croqui;
      });
      return via;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar via');
    }
  }

  async getAllVias (page = 1, limit = 10): Promise<{ vias: Via[], total: number }> {
    try {
      const response = await api.get('/vias/', {
        params: {
          page,
          limit
        }
      });
      const vias = response.data.vias as Via[];
      const total = response.data.total as number;

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return { vias, total };
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar vias');
    }
  }

  async searchVias (query: string, filters?: any): Promise<{ vias: Via[], total: number }> {
    try {
      const response = await api.get('/vias/search', { params: { name: query, ...filters } });
      const vias = response.data.vias as Via[];
      const total = response.data.total as number;

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return { vias, total };
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar vias');
    }
  }
}

export default new ViaService();

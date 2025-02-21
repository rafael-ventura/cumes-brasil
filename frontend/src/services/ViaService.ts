import { Via } from 'src/models/Via';
import { api } from 'boot/axios';
import croquiService from 'src/services/CroquiService';
import { adjustImageUrls, formatVia, handleApiError } from 'src/utils/utils';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';

class ViaService {
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      let via = response.data as Via;
      via = await this.adjustAndFormatVia(via);
      return via;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar via');
    }
  }

  async getAllVias (page?: number, limit?: number): Promise<{ vias: Via[]; total: number }> {
    try {
      const params: any = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;

      const response = await api.get('/vias/', { params });
      const vias = response.data.vias as Via[];
      const total = response.data.total as number;
      vias.forEach(via => adjustImageUrls(via.imagem));
      return {
        vias,
        total
      };
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar vias');
    }
  }

  async addToFavorites (viaId: number): Promise<void> {
    try {

      const favoritosColecao = await ColecaoService.obterColecaoFavoritos();

      if (!favoritosColecao) {
        throw new Error('Coleção de favoritos não encontrada');
      }

      await ColecaoService.adicionarViaNaColecao(favoritosColecao.id, viaId);
    } catch (error: any) {
      handleApiError(error, 'Erro ao adicionar via aos favoritos');
    }
  }

  private async adjustAndFormatVia (via: Via): Promise<Via> {
    adjustImageUrls(via.imagem);
    via.croquis = await croquiService.getCroquiByViaId(via.id);
    via.croquis.forEach(croqui => adjustImageUrls(croqui));
    return formatVia(via);
  }
}

export default new ViaService();

import { api } from "boot/axios";
import { Via } from "src/models/Via";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImageService";
import { SearchService } from "src/models/SearchService";

class ViaService implements SearchService<Via> {
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      const via = response.data as Via;

      if (via.imagem?.url) {
        via.imagem.url = adjustImageUrl(via.imagem.url);
      }
      return via;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar via");
    }
  }

  async getAllVias (): Promise<Via[]> {
    try {
      const response = await api.get("/vias/");
      const vias = response.data as Via[];

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return vias;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }

  async getViasInColecao (colecaoId: string | RouteParamValue[], filters?: any): Promise<Via[]> {
    try {
      const response = await api.get(`/vias/colecao/${colecaoId}`, { params: filters });
      const vias = response.data as Via[];

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return vias;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias da coleção");
    }
  }

  async search (query: any): Promise<Via[]> {
    try {
      const response = await api.get("/vias/search", { params: query });
      const vias = response.data as Via[];

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return vias;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }
}

export default new ViaService();

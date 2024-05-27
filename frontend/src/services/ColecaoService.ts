import { api } from "boot/axios";
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImageService";

class ColecaoService {
  async getById (id: string | RouteParamValue[]): Promise<Colecao> {
    try {
      const response = await api.get(`/colecoes/${id}`);
      const colecao = response.data;

      // Adjust image URL using the utility function
      if (colecao.imagem?.url) {
        colecao.imagem.url = adjustImageUrl(colecao.imagem.url);
      }

      return colecao;
    } catch (error: any) {
      throw new Error("Erro ao buscar detalhes da coleção: " + error.message);
    }
  }

  async getAll (): Promise<Colecao[]> {
    try {
      const response = await api.get("/colecoes");
      const colecoes = response.data;

      // Adjust image URLs for all collections
      for (const colecao of colecoes) {
        if (colecao.imagem?.url) {
          colecao.imagem.url = adjustImageUrl(colecao.imagem.url);
        }
      }

      return colecoes;
    } catch (error: any) {
      throw new Error("Erro ao buscar coleções: " + error.message);
    }
  }

  async getViasInColecao (colecaoId: string | RouteParamValue[]): Promise<Via[]> {
    try {
      const response = await api.get(`/vias/colecao/${colecaoId}`);
      const vias = response.data;

      for (const via of vias) {
        if (via.imagem?.url) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return vias;
    } catch (error: any) {
      throw new Error("Erro ao buscar vias da coleção: " + error.message);
    }
  }
}

export default new ColecaoService();

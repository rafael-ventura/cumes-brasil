// services/ViaService.ts

import { api } from "boot/axios";
import { Via } from "src/models/Via";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImageService";

class ViaService {
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

  async createVia (via: Via) {
    try {
      await api.post("/vias", via);
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao criar via");
    }
  }

  // TODO: DESENVOLVER AMBOS ENDPOINTS ABAIXO NO BACKEND, TAREFA DO @VITOR.
  async searchVias (query: string): Promise<Via[]> {
    try {
      const response = await api.get("/vias/search", { params: { query } });
      return response.data;
    } catch (error: any) {
      throw new Error("Erro desconhecido ao buscar vias");
    }
  }

  async searchViasWithFilters (filters: any): Promise<Via[]> {
    try {
      const response = await api.get("/vias/search", { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error("Erro desconhecido ao buscar vias com filtros");
    }
  }

  async getViasInColecao (colecaoId: string | RouteParamValue[]): Promise<Via[]> {
    try {
      const response = await api.get(`/vias/colecao/${colecaoId}`);
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
}

export default new ViaService();

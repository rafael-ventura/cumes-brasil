// services/ViaService.ts

import { api } from "boot/axios";
import { Via } from "src/models/Via";

export class ViaService {
  // Chamadas da API de vias
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar via");
    }
  }

  async getAllVias (): Promise<Via[]> {
    try {
      const response = await api.get("/vias");
      return response.data;
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
}

export default new ViaService();

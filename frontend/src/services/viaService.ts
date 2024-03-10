// services/ViaService.ts

import apiClient from "./apiService";
import { ViaModel } from "@/models/viaModel";

export class ViaService {
  // Chamadas da API de vias
  async getViaById (id: number | string) {
    try {
      const response = await apiClient.get(`/vias/${id}`);
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar via");
    }
  }

  async getAllVias (): Promise<ViaModel[]> {
    try {
      const response = await apiClient.get("/vias");
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }

  async createVia (via: any) {
    try {
      await apiClient.post("/vias", via);
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao criar via");
    }
  }

  async searchVias (query: any) {
    try {
      const response = await apiClient.get("/vias/search", { params: query });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }
}

export default new ViaService();

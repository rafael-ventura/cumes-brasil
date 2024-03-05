// services/ViaService.ts

import apiClient from "./apiService";

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

  async getAllVias () {
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
}

export default new ViaService();

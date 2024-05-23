// services/ViaService.ts

import apiClient from "./apiService";
import { ViaModel } from "@/models/viaModel";

export class ViaService implements ISearchService<ViaModel>{
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
      console.log("Buscando vias");
      const response = await apiClient.get("/vias");
      console.log("Response:", response.data); // Adicione esta linha
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

  async search (query: any): Promise<ViaModel[]> {
    console.log("Query:", query);
    try {
      const response = await apiClient.get("/vias/search", { params: query });
      console.log("Response:", response);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }
}

export default new ViaService();

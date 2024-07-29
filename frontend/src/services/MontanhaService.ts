// services/ViaService.ts

import apiClient from "./apiService";
import { MontanhaModel } from "@/models/montanhaModel";

export class MontanhaService {
  // Chamadas da API de vias
  async getById (id: number | string) {
    try {
      const response = await apiClient.get(`/montanhas/${id}`);
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar montanha");
    }
  }

  async getAll (): Promise<MontanhaModel[]> {
    try {
      const response = await apiClient.get("/montanhas");
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar montanha");
    }
  }

  async create (via: any) {
    try {
      await apiClient.post("/montanhas", via);
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao criar montanha");
    }
  }
}

export default new MontanhaService();

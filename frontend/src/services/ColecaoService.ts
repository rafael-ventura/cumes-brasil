import { api } from "boot/axios";
import { Colecao } from "src/models/Colecao";

class ColecaoService {
  async getColecaoById (id: number): Promise<Colecao> {
    try {
      const response = await api.get(`/colecoes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Erro ao buscar detalhes da coleção: " + error.message);
    }
  }

  async getAllColecoes (): Promise<Colecao[]> {
    try {
      const response = await api.get("/colecoes");
      return response.data;
    } catch (error: any) {
      throw new Error("Erro ao buscar coleções: " + error.message);
    }
  }
}

export default new ColecaoService();

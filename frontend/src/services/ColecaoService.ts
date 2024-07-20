import { api } from "boot/axios";
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImagemService";
import ViaService from "src/services/ViaService";
import { UnwrapRef } from "vue";

class ColecaoService {
  async getById (id: string | RouteParamValue[]): Promise<Colecao> {
    try {
      const response = await api.get(`/colecoes/${id}`);
      const colecao = response.data;

      if (colecao.imagem?.url) {
        colecao.imagem.url = adjustImageUrl(colecao.imagem.url);
      }

      return colecao;
    } catch (error: any) {
      throw new Error("Erro ao buscar detalhes da coleção: " + error.message);
    }
  }

  async getByUsuarioId (): Promise<Colecao[]> {
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.get(`/colecoes/usuario/${userId}`);
      const colecoes = response.data;

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

  async create (colecao: Omit<Colecao, "id">): Promise<void> { // Remove 'id' para criação
    try {
      await api.post("/colecoes", colecao);
    } catch (error: any) {
      throw new Error("Erro ao criar coleção: " + error.message);
    }
  }

  async delete (colecaoId: UnwrapRef<Colecao["id"]>): Promise<void> {
    try {
      await api.delete(`/colecoes/${colecaoId}`);
    } catch (error: any) {
      throw new Error("Erro ao deletar coleção: " + error.message);
    }
  }

  async update (colecaoId: UnwrapRef<Colecao["id"]>, colecao: UnwrapRef<{
    nome: string;
    descricao: string
  }>): Promise<void> {
    try {
      await api.put(`/colecoes/${colecaoId}`, colecao);
    } catch (error: any) {
      throw new Error("Erro ao atualizar coleção: " + error.message);
    }
  }

  async getViasIn (colecaoId: string | RouteParamValue[]): Promise<Via[]> {
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

  async searchByName (query: string): Promise<Colecao[]> {
    try {
      const response = await api.get("/colecoes/search", { params: { name: query } });
      const colecoes = response.data;

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

  async search (filters: any): Promise<Colecao[]> {
    try {
      const response = await api.get("/colecoes/search", { params: filters });
      const colecoes = response.data;

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

  async sortVias (vias: Via[], { key, order }: { key: keyof Via; order: "asc" | "desc" | null }): Promise<Via[]> {
    const sortedVias = [...vias];
    if (key === "grau" && order !== null) {
      sortedVias.sort((a, b) => {
        const grauA = a.grau ? ViaService.romanToInt(a.grau) : 0;
        const grauB = b.grau ? ViaService.romanToInt(b.grau) : 0;
        return order === "asc" ? grauA - grauB : grauB - grauA;
      });
    } else if (key === "duracao" && order !== null) {
      const durationMap: Record<string, number> = { D1: 1, D2: 2, D3: 3, D4: 4 };
      sortedVias.sort((a, b) => {
        const aDur = durationMap[a.duracao || ""] || 0;
        const bDur = durationMap[b.duracao || ""] || 0;
        return order === "asc" ? aDur - bDur : bDur - aDur;
      });
    } else if (key === "extensao" && order !== null) {
      sortedVias.sort((a, b) => {
        const extensaoA = a.extensao ?? 0; // Usa 0 como valor padrão se a.extensao for null ou undefined
        const extensaoB = b.extensao ?? 0; // Usa 0 como valor padrão se b.extensao for null ou undefined
        return order === "asc" ? extensaoA - extensaoB : extensaoB - extensaoA;
      });
    } else if (key === "data" && order !== null) {
      sortedVias.sort((a, b) => order === "asc" ? a.id - b.id : b.id - a.id);
    }
    return sortedVias;
  }
}

export default new ColecaoService();

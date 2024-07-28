import { api } from "boot/axios";
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImageService";

// Função para converter números romanos para inteiros
const romanToInt = (roman: string): number => {
  const romanMap: { [key: string]: number } = { I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400, D: 500, CM: 900, M: 1000 };
  let num = 0;
  let i = 0;
  while (i < roman.length) {
    if (i + 1 < roman.length && romanMap[roman.substring(i, i + 2)]) {
      num += romanMap[roman.substring(i, i + 2)];
      i += 2;
    } else {
      num += romanMap[roman.charAt(i)];
      i++;
    }
  }
  return num;
};

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

  async getColecaoByUsuarioId (): Promise<Colecao[]> {
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
        const grauA = a.grau ? romanToInt(a.grau) : 0;
        const grauB = b.grau ? romanToInt(b.grau) : 0;
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

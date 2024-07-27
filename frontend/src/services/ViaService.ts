import { api } from "boot/axios";
import { Via } from "src/models/Via";
import { CroquiService } from "src/services/CroquiService";
import { RouteParamValue } from "vue-router";
import { adjustImageUrl } from "src/services/ImagemService";

class ViaService {
  async getViaById (id: number | string): Promise<Via> {
    try {
      const response = await api.get(`/vias/${id}`);
      const via = response.data as Via;
      const croquiService = new CroquiService();
      const croquis = await croquiService.getCroquiByViaId(via.id);
      via.croquis = croquis.map(croqui => {
        if (croqui.imagem?.url) {
          croqui.imagem.url = adjustImageUrl(croqui.imagem.url);
        }
        return croqui;
      });
      console.log(via);
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
        if (via.imagem?.id) {
          via.imagem.url = adjustImageUrl(via.imagem.url);
        }
      }
      return vias;
    } catch (error: any) {
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar vias");
    }
  }

  async getViasInColecao (colecaoId: string | RouteParamValue[], filters?: any): Promise<Via[]> {
    try {
      const response = await api.get(`/vias/colecao/${colecaoId}`, { params: filters });
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

  async searchVias (query: string, filters: any): Promise<Via[]> {
    try {
      const response = await api.get("/vias/search", { params: { name: query, ...filters } });
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

  romanToInt = (roman: string): number => {
    const romanMap: { [key: string]: number } = {
      I: 1,
      IV: 4,
      V: 5,
      IX: 9,
      X: 10,
      XL: 40,
      L: 50,
      XC: 90,
      C: 100,
      CD: 400,
      D: 500,
      CM: 900,
      M: 1000
    };
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
}

export default new ViaService();

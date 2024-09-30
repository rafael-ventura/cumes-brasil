import { api } from 'boot/axios';
import { Colecao } from 'src/models/Colecao';
import { Via } from 'src/models/Via';
import { RouteParamValue } from 'vue-router';
import { getFullImageUrl } from 'src/services/ImagemService';
import { formatVia, romanToInt } from 'src/utils/utils';
import { UnwrapRef } from 'vue';

class ColecaoService {
  async getByUsuarioId (): Promise<Colecao[]> {
    const userId = localStorage.getItem('userId');
    try {
      const response = await api.get(`/colecoes/usuario/${userId}`);
      const colecoes = response.data;

      for (const colecao of colecoes) {
        if (colecao.imagem?.url) {
          colecao.imagem.url = getFullImageUrl(colecao.imagem.url);
        }
      }
      return colecoes;
    } catch (error: any) {
      throw new Error('Erro ao buscar coleções: ' + error.message);
    }
  }

  async create (colecao: { nome: string; descricao: string; usuario_id: number; imagem_id: number }): Promise<void> {
    try {
      await api.post('/colecoes', colecao);
    } catch (error: any) {
      throw new Error('Erro ao criar coleção: ' + error.message);
    }
  }

  async delete (colecaoId: UnwrapRef<Colecao['id']>): Promise<void> {
    try {
      await api.delete(`/colecoes/${colecaoId}`);
    } catch (error: any) {
      throw new Error('Erro ao deletar coleção: ' + error.message);
    }
  }

  async update (colecaoId: UnwrapRef<Colecao['id']>, colecao: UnwrapRef<{
    nome: string;
    descricao: string
  }>): Promise<void> {
    try {
      await api.put(`/colecoes/${colecaoId}`, colecao);
    } catch (error: any) {
      throw new Error('Erro ao atualizar coleção: ' + error.message);
    }
  }

  async getById (id: string | RouteParamValue[]): Promise<Colecao> {
    try {
      const response = await api.get(`/colecoes/${id}`);
      const colecao = response.data;

      if (colecao.imagem?.url) {
        colecao.imagem.url = getFullImageUrl(colecao.imagem.url);
      }

      return colecao;
    } catch (error: any) {
      throw new Error('Erro ao buscar detalhes da coleção: ' + error.message);
    }
  }

  async getViasIn (colecaoId: string | RouteParamValue[]): Promise<Via[]> {
    try {
      const response = await api.get(`/vias/colecao/${colecaoId}`);
      const { vias } = response.data;
      return vias.map(formatVia);
    } catch (error: any) {
      throw new Error('Erro ao buscar vias da coleção: ' + error.message);
    }
  }

  async getViasNotIn (colecaoId: string, page: number, limit = 10): Promise<{ vias: Via[], total: number }> {
    try {
      const response = await api.get(`/vias/colecao/not/${colecaoId}`, {
        params: {
          page,
          limit
        }
      });

      return {
        vias: response.data.vias.map(formatVia),
        total: response.data.total
      };
    } catch (error: any) {
      throw new Error('Erro ao buscar vias não adicionadas à coleção: ' + error.message);
    }
  }

  async getCollecoesNotContainingVia (viaId: number, page: number, limit: number): Promise<{
    colecoes: Colecao[],
    total: number
  }> {
    const response = await api.get(`/colecoes/not-containing-via/${viaId}`, {
      params: {
        page,
        limit
      }
    });
    return response.data;
  }

  async searchByName (query: string): Promise<Colecao[]> {
    try {
      const response = await api.get('/colecoes/search', { params: { name: query } });
      const colecoes = response.data;

      for (const colecao of colecoes) {
        if (colecao.imagem?.url) {
          colecao.imagem.url = getFullImageUrl(colecao.imagem.url);
        }
      }

      return colecoes;
    } catch (error: any) {
      throw new Error('Erro ao buscar coleções: ' + error.message);
    }
  }

  async search (filters: any): Promise<Colecao[]> {
    try {
      const response = await api.get('/colecoes/search', { params: filters });
      const colecoes = response.data;

      for (const colecao of colecoes) {
        if (colecao.imagem?.url) {
          colecao.imagem.url = getFullImageUrl(colecao.imagem.url);
        }
      }

      return colecoes;
    } catch (error: any) {
      throw new Error('Erro ao buscar coleções: ' + error.message);
    }
  }

  async sortVias (vias: Via[], {
    key,
    order
  }: { key: keyof Via; order: 'asc' | 'desc' | null }): Promise<Via[]> {
    const sortedVias = [...vias];
    if (key === 'grau' && order !== null) {
      sortedVias.sort((a, b) => {
        const grauA = a.grau ? romanToInt(a.grau) : 0;
        const grauB = b.grau ? romanToInt(b.grau) : 0;
        return order === 'asc' ? grauA - grauB : grauB - grauA;
      });
    } else if (key === 'duracao' && order !== null) {
      const durationMap: Record<string, number> = { D1: 1, D2: 2, D3: 3, D4: 4 };
      sortedVias.sort((a, b) => {
        const aDur = durationMap[a.duracao || ''] || 0;
        const bDur = durationMap[b.duracao || ''] || 0;
        return order === 'asc' ? aDur - bDur : bDur - aDur;
      });
    } else if (key === 'extensao' && order !== null) {
      sortedVias.sort((a, b) => {
        const extensaoA = a.extensao ?? 0;
        const extensaoB = b.extensao ?? 0;
        return order === 'asc' ? extensaoA - extensaoB : extensaoB - extensaoA;
      });
    } else if (key === 'data' && order !== null) {
      sortedVias.sort((a, b) => order === 'asc' ? a.id - b.id : b.id - a.id);
    }
    return sortedVias;
  }

  async addViaToColecao (colecaoId: number, viaId: number): Promise<void> {
    try {
      const url = `/colecoes/adicionarVia?colecao_id=${colecaoId}&via_id=${viaId}`;
      await api.post(url);
    } catch (error: any) {
      throw new Error('Erro ao adicionar via à coleção: ' + error.response?.data?.message || error.message);
    }
  }
}

export default new ColecaoService();

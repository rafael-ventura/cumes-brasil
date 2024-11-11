import { api } from 'boot/axios';
import { IColecao } from 'src/models/IColecao';
import { Via } from 'src/models/Via';
import { RouteParamValue } from 'vue-router';
import { adjustImageUrls, formatVia, handleApiError, romanToInt } from 'src/utils/utils';
import { UnwrapRef } from 'vue';

class ColecaoService {
  async getFirstByUsuarioId (): Promise<IColecao | null> {
    const userId = localStorage.getItem('userId');
    try {
      const colecoes = await this.getColecoes(`/colecoes/usuario/${userId}`);
      if (colecoes.length > 0) {
        const primeiraColecao = colecoes[0];
        if (primeiraColecao.nome.includes('Favoritas')) {
          return primeiraColecao;
        }
        // Fallback: procura uma coleção com nome "Vias Favoritas"
        const colecaoFavoritas = colecoes.find(colecao => colecao.nome === 'Vias Favoritas');
        return colecaoFavoritas || null;
      }

      console.warn('Nenhuma coleção encontrada para este usuário.');
      return null;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar coleção de favoritas');
      return null;
    }
  }

  async getByUsuarioId (): Promise<IColecao[] | undefined> {
    const userId = localStorage.getItem('userId');
    return this.getColecoes(`/colecoes/usuario/${userId}`);
  }

  async getById (id: number): Promise<IColecao | undefined> {
    return this.getColecao(`/colecoes/${id}`);
  }

  async create (colecao: IColecao): Promise<void> {
    try {
      await api.post('/colecoes', colecao);
    } catch (error: any) {
      handleApiError(error, 'Erro ao criar coleção');
    }
  }

  async delete (colecaoId: UnwrapRef<IColecao['id']>): Promise<void> {
    try {
      await api.delete(`/colecoes/${colecaoId}`);
    } catch (error: any) {
      handleApiError(error, 'Erro ao deletar coleção');
    }
  }

  async update (
    colecaoId: UnwrapRef<IColecao['id']>,
    colecao: UnwrapRef<{ nome: string; descricao: string }>
  ): Promise<void> {
    try {
      await api.put(`/colecoes/${colecaoId}`, colecao);
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar coleção');
    }
  }

  async getViasIn (colecaoId: number | RouteParamValue[]): Promise<Via[] | undefined> {
    return this.getVias(`/vias/colecao/${colecaoId}`);
  }

  async getViasNotIn (colecaoId: number, page: number, limit = 10): Promise<{ vias: Via[]; total: number }> {
    try {
      const response = await api.get(`/vias/colecao/not/${colecaoId}`, {
        params: {
          page,
          limit
        }
      });
      const vias = response.data.vias as Via[];
      vias.forEach(
        via => adjustImageUrls(via.imagem)
      );
      return {
        vias: vias.map(formatVia),
        total: response.data.total
      };
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar vias');
      return {
        vias: [],
        total: 0
      };
    }
  }

  async getCollecoesNotContainingVia (viaId: number, page: number, limit: number): Promise<{
    colecoes: IColecao[];
    total: number
  }> {
    const response = await api.get(`/colecoes/not-containing-via/${viaId}`, {
      params: {
        page,
        limit
      }
    });
    response.data.colecoes.forEach(adjustImageUrls);
    return response.data;
  }

  async searchByName (query: string): Promise<IColecao[] | undefined> {
    return this.search({ name: query });
  }

  async search (filters: any): Promise<IColecao[] | undefined> {
    return this.getColecoes('/colecoes/search', filters);
  }

  async addViaToColecao (colecaoId: number, viaId: number): Promise<void> {
    try {
      await api.post('/colecoes/adicionarVia', null, {
        params: {
          colecao_id: colecaoId,
          via_id: viaId
        }
      });
    } catch (error: any) {
      handleApiError(error, 'Erro ao adicionar via à coleção');
    }
  }

  async removeViaFromColecao (colecaoId: number, viaId: number): Promise<void> {
    try {
      await api.post('/colecoes/removerVia', null, {
        params: {
          colecao_id: colecaoId,
          via_id: viaId
        }
      });
    } catch (error: any) {
      handleApiError(error, 'Erro ao remover via da coleção');
    }
  }

  async sortVias (vias: Via[], {
    key,
    order
  }: { key: keyof Via; order: 'asc' | 'desc' | null }): Promise<Via[]> {
    if (!order) return vias;

    const compare = this.getComparator(order, key);
    return [...vias].sort(compare);
  }

  // Métodos privados para evitar redundância e melhorar a manutenção
  private async getColecao (url: string): Promise<IColecao | undefined> {
    try {
      const response = await api.get(url);
      const colecao = response.data as IColecao;
      if (colecao.imagem) {
        adjustImageUrls(colecao.imagem);
      }
      return colecao;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar coleção');
    }
  }

  private async getColecoes (url: string, params?: any): Promise<IColecao[]> {
    try {
      const response = await api.get(url, { params });
      const colecoes = response.data as IColecao[];
      colecoes.forEach(
        colecao => {
          if (colecao.imagem) {
            adjustImageUrls(colecao.imagem);
          }
        }
      );
      return colecoes;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar coleções');
      return [];
    }
  }

  private async getVias (url: string): Promise<Via[] | undefined> {
    try {
      const response = await api.get(url);
      const vias = response.data.vias as Via[];
      vias.forEach(
        via => adjustImageUrls(via.imagem)
      );
      return vias.map(formatVia);
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar vias');
    }
  }

  private getComparator (order: 'asc' | 'desc', key: keyof Via): (a: Via, b: Via) => number {
    switch (key) {
      case 'grau':
        return (a, b) => this.compareRomanValues(order, a.grau, b.grau);
      case 'duracao':
        return (a, b) => this.compareDuration(order, a.duracao, b.duracao);
      case 'extensao':
        return (a, b) => this.compareValues(order, a.extensao, b.extensao);
      case 'data':
        return (a, b) => this.compareDates(order, a.data, b.data);
      default:
        return () => 0;
    }
  }

  private compareDates (order: 'asc' | 'desc', a?: string, b?: string): number {
    const valueA = a ? new Date(a).getTime() : 0;
    const valueB = b ? new Date(b).getTime() : 0;
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  }

  private compareRomanValues (order: 'asc' | 'desc', a?: string, b?: string): number {
    const valueA = a ? romanToInt(a) : 0;
    const valueB = b ? romanToInt(b) : 0;
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  }

  private compareDuration (order: 'asc' | 'desc', a?: string, b?: string): number {
    const durationMap: Record<string, number> = {
      D1: 1,
      D2: 2,
      D3: 3,
      D4: 4
    };
    const valueA = durationMap[a || ''] || 0;
    const valueB = durationMap[b || ''] || 0;
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  }

  private compareValues (order: 'asc' | 'desc', a?: number, b?: number): number {
    const valueA = a ?? 0;
    const valueB = b ?? 0;
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  }
}

export default new ColecaoService();

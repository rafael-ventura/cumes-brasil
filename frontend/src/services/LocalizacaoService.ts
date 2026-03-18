import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';

export interface LocationNode {
  id: number;
  nome: string;
  sigla?: string;
  totalVias: number;
  estados?: LocationNode[];
  cidades?: LocationNode[];
  bairros?: LocationNode[];
  montanhas?: Array<{
    id: number;
    nome: string;
    totalVias: number;
  }>;
}

export interface ExplorerStats {
  total_vias: number;
  total_montanhas: number;
  total_paises: number;
  total_estados: number;
  total_cidades: number;
  modalidades: string;
  vias_cerj: number;
}

export class LocalizacaoService {
  async getLocationHierarchy(): Promise<LocationNode[]> {
    try {
      const response = await api.get('/localizacoes/hierarchy');
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar hierarquia de localizações');
    }
  }

  async getStatsForExplorer(): Promise<ExplorerStats> {
    try {
      const response = await api.get('/localizacoes/stats');
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar estatísticas do explorador');
    }
  }
}

export default new LocalizacaoService();

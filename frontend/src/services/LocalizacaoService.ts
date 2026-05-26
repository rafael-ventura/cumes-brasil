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

export class LocalizacaoService {
  async getLocationHierarchy(): Promise<LocationNode[]> {
    try {
      const response = await api.get('/localizacoes/hierarchy');
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar hierarquia de localizações');
      return [];
    }
  }
}

export default new LocalizacaoService();

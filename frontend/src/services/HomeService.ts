import { api } from 'boot/axios';
import searchService from 'src/services/SearchService';
import { Via } from 'src/models/Via';
import { getViaImageUrlFull } from 'src/utils/utils';

export interface IEstatisticas {
  vias: number;
  montanhas: number;
  croquis: number;
  usuarios: number;
}

class HomeService {
  async obterContagem(filtro: string): Promise<number> {
    try {
      const codificado = encodeURIComponent(filtro);
      const resposta = await api.get(`/vias/count/${codificado}`);
      return resposta.data.total;
    } catch (erro: any) {
      console.error(`Erro ao obter contagem para o filtro ${filtro}:`, erro);
      return 0;
    }
  }

  async obterImagemPorFiltro(filtro: string): Promise<string | null> {
    try {
      const pagina = Math.floor(Math.random() * 3) + 1;
      const resultado = await searchService.search({
        tipoEntidade: 'via',
        ...(this.parseFiltroParaBusca(filtro)),
        pagina,
        itensPorPagina: 5
      });

      const vias = (resultado.items || []) as Via[];
      const viasComImagem = vias.filter(v => getViaImageUrlFull(v));
      if (viasComImagem.length === 0) return null;

      const aleatorio = viasComImagem[Math.floor(Math.random() * viasComImagem.length)];
      return getViaImageUrlFull(aleatorio);
    } catch {
      return null;
    }
  }

  async obterEstatisticas(): Promise<IEstatisticas> {
    try {
      const resposta = await api.get('/stats');
      return resposta.data;
    } catch (erro: any) {
      console.error('Erro ao obter estatísticas:', erro);
      return { vias: 0, montanhas: 0, croquis: 0, usuarios: 0 };
    }
  }

  private parseFiltroParaBusca(filtro: string): Record<string, unknown> {
    if (filtro.includes('=')) {
      const [chave, valor] = filtro.split('=');
      const mapa: Record<string, string> = {
        bairro: 'nomeBairro',
        grau: 'grau',
        exposicao: 'exposicao',
        via_cerj: 'viaCerj',
        duracao: 'duracao',
      };
      const campo = mapa[chave] || chave;
      const valorFinal = valor === 'true' ? true : valor === 'false' ? false : valor;
      return { [campo]: valorFinal };
    }
    return {};
  }
}

export default new HomeService();

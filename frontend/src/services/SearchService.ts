import { api } from 'boot/axios';
import { SearchResult } from 'src/models/SearchResult';
import { BuscaRequest } from 'src/models/BuscaRequest';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';

class SearchService {
  async search(requisicao: BuscaRequest): Promise<SearchResult> {
    const response = await api.post('/search', requisicao);
    const resultado = response.data as SearchResult;

    if (requisicao.tipoEntidade === 'via') {
      resultado.items = resultado.items.map((item: any) => {
        const via = formatVia(item as Via);
        if (via.imagem?.url) {
          via.imagem.url = ImagemService.obterUrlCompleta(via.imagem.url);
        }
        return via;
      });
    }
    return resultado;
  }
}

export default new SearchService();

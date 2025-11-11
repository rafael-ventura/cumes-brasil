import { api } from 'boot/axios';
import { SearchResult } from 'src/models/SearchResult';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';

class SearchService {
  async search (searchRequest: any) {
    const response = await api.post('/search', searchRequest);
    const searchResult = response.data as SearchResult;
    // Formatar as entidades do tipo Via
    if (searchRequest.entityType === 'Via') {
      searchResult.items = searchResult.items.map((item: any) => {
        const via = formatVia(item as Via);
        if (via.imagem?.url) {
          via.imagem.url = ImagemService.getFullImageUrl(via.imagem.url);
        }
        return via;
      });
    }
    return searchResult;
  }
}

export default new SearchService();

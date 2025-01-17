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
      searchResult.items = searchResult.items.map((item: any) => formatVia(item as Via));
      searchRequest.items = searchResult.items.map((item: any) => ImagemService.getFullImageUrl(item.imagem.url));
    }
    return searchResult;
  }
}

export default new SearchService();

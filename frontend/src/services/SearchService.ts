import { api } from 'boot/axios';
import { SearchResult } from 'src/models/SearchResult';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';

class SearchService {
  async search (searchRequest: any) {
    try {
      console.log('Search request received: ', searchRequest);
      const response = await api.post('/search', searchRequest);
      console.log(response);
      const searchResult = response.data as SearchResult;

      // Formatar as entidades do tipo Via
      if (searchRequest.entityType === 'Via') {
        searchResult.items = searchResult.items.map((item: any) => formatVia(item as Via));
        searchRequest.items = searchResult.items.map((item: any) => ImagemService.getFullImageUrl(item.imagem.url));
      }

      return searchResult;
    } catch (error) {
      console.error('API error: ', error);
      throw error;
    }
  }
}

export default new SearchService();

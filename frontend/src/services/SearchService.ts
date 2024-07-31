import { api } from 'boot/axios';
import { SearchResult } from 'src/models/SearchResult';

class SearchService {
  async search (searchRequest: any) {
    try {
      console.log('Search request received: ', searchRequest);
      const response = await api.post('/search', searchRequest);
      return response.data as SearchResult<any>;
    } catch (error) {
      console.error('API error: ', error);
      throw error;
    }
  }
}

export default new SearchService();

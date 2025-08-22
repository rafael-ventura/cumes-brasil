import {api} from 'boot/axios';

class ImageService {
  private readonly baseUrl: string;

  constructor() {
    // ex: https://api.cumesbrasil.com.br/api
    const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';
    // remove o /api para usar como base em local/dev
    this.baseUrl = apiUrl.replace('/api', '');
  }

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';

    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    if (relativePath.startsWith('/assets') || relativePath.startsWith('assets')) {
      return `${this.baseUrl}/${relativePath.replace(/^\/?/, '')}`;
    }

    return `${this.baseUrl}/assets/${relativePath}`;
  }


  async getImageById(id: number): Promise<any> {
    try {
      const response = await api.get(`/imagens/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar imagem');
    }
  }
}

export default new ImageService();

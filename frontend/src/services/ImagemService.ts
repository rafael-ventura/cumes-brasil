import {api} from 'boot/axios';

class ImageService {
  private readonly apiUrl: string;
  private readonly assetsUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';
    this.assetsUrl = import.meta.env.VITE_APP_ASSETS_URL || 'http://localhost:8080/assets';
  }

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath;

    return `${this.assetsUrl}/${relativePath.replace(/^\/?assets?\//, '')}`;
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

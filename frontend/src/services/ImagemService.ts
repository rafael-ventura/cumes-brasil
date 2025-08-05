import { api } from 'boot/axios';

class ImageService {
  private readonly baseUrl: string;

  constructor () {
    const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';
    this.baseUrl = apiUrl.replace('/api', '');
  }

  getFullImageUrl (relativePath: string): string {
    if (!relativePath) {
      console.warn('O caminho relativo da imagem não foi fornecido.');
      return '';
    }
    if (relativePath.startsWith('https://')) {
      return relativePath;
    }
    // Remove /assets se já estiver no caminho para evitar duplicação
    const cleanPath = relativePath.startsWith('/assets') ? relativePath : `/assets${relativePath}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  async getImageById (id: number): Promise<any> {
    try {
      const response = await api.get(`/imagens/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar imagem');
    }
  }
}

export default new ImageService();

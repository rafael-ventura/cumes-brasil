import { api } from 'boot/axios';

class ImageService {
  private readonly baseUrl: string;

  constructor () {
    const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';
    this.baseUrl = apiUrl.replace('/api', '');
  }

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';

    // Se já vier absoluta (https://), só retorna
    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    // Se backend mandar apenas o nome do arquivo
    return `${this.baseUrl}${relativePath}`;
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

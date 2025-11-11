import {api} from 'boot/axios';

class ImageService {
    private readonly assetsUrl: string;

  constructor() {
    this.assetsUrl = import.meta.env.VITE_APP_ASSETS_URL || 'http://localhost:8080/assets';
  }

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    // Se já é uma URL completa (http/https), retornar como está
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // Processar URL relativa
    const cleanPath = relativePath.replace(/^\/?assets?\//, '');
    return `${this.assetsUrl}/${cleanPath}`;
  }

  async getImageById(id: number): Promise<any> {
    const response = await api.get(`/imagens/${id}`);
    return response.data;
  }
}

export default new ImageService();

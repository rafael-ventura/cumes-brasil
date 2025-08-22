import {api} from 'boot/axios';

class ImageService {
    private readonly assetsUrl: string;

  constructor() {
    this.assetsUrl = import.meta.env.VITE_APP_ASSETS_URL || 'http://localhost:8080/assets';
  }

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath;

    return `${this.assetsUrl}/${relativePath.replace(/^\/?assets?\//, '')}`;
  }

  async getImageById(id: number): Promise<any> {
    const response = await api.get(`/imagens/${id}`);
    return response.data;
  }
}

export default new ImageService();

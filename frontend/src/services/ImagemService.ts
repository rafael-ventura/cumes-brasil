import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';

class ImagemService {
  private readonly assetsUrl: string;

  constructor() {
    const envAssets = import.meta.env.VITE_APP_ASSETS_URL;
    if (envAssets) {
      this.assetsUrl = envAssets.replace(/\/$/, '');
    } else {
      const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';
      const base = apiUrl.replace(/\/api\/?$/, '');
      this.assetsUrl = `${base}/assets`;
    }
  }

  obterUrlCompleta(relativePath: string): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    const cleanPath = relativePath.replace(/^\/?assets?\//, '');
    return `${this.assetsUrl}/${cleanPath}`;
  }

  async obterPorId(id: number): Promise<any> {
    try {
      const response = await api.get(`/imagens/${id}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar imagem');
    }
  }
}

export default new ImagemService();

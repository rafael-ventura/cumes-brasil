class ImageService {
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

  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    const cleanPath = relativePath.replace(/^\/?assets?\//, '');
    return `${this.assetsUrl}/${cleanPath}`;
  }

  async getImageById(id: number): Promise<any> {
    const response = await api.get(`/imagens/${id}`);
    return response.data;
  }
}

export default new ImageService();

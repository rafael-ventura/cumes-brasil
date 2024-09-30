// src/services/HomeService.ts
import ViaService from './ViaService';
import { Via } from 'src/models/Via';
import { getFullImageUrl } from 'src/services/ImagemService';

class HomeService {
  async getViasNaUrca (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias(); // Busca todas as vias

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = getFullImageUrl(via.imagem.url);
      }
    }
    return vias.filter((via: Via) => via.montanha?.bairro?.toLowerCase() === 'leme');
  }

  async getViasDeTerceiroGrau (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias();

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = getFullImageUrl(via.imagem.url);
      }
    }

    return vias.filter((via: Via) => this.isTerceiroGrau(via.grau));
  }

  private isTerceiroGrau (grau: string | undefined): boolean {
    if (!grau) return false;

    const normalizedGrau = grau.replace(/\s+/g, '').toLowerCase();

    const terceiroGrauRepresentations = ['3', '3.0', 'iii', '3sup', 'iii sup', 'iiisup'];

    return terceiroGrauRepresentations.includes(normalizedGrau);
  }

  async getViasComExposicaoMenorOuIgualE2 (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias();

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = getFullImageUrl(via.imagem.url);
      }
    }
    return vias.filter((via: Via) => via.exposicao?.toLowerCase() === 'e2' || via.exposicao?.toLowerCase() === 'e1');
  }
}

export default new HomeService();

// src/services/HomeService.ts
import ViaService from './ViaService';
import { Via } from 'src/models/Via';
import { adjustImageUrl } from 'src/services/ImagemService';

class HomeService {
  async getViasNaUrca (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias(1);

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = adjustImageUrl(via.imagem.url);
      }
    }
    return vias.filter((via: Via) => via.montanha?.bairro?.toLowerCase() === 'urca');
  }

  async getViasDeTerceiroGrau (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias(1);

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = adjustImageUrl(via.imagem.url);
      }
    }
    return vias.filter((via: Via) => via.grau?.toLowerCase().includes('3') || via.grau?.toLowerCase().includes('sup'));
  }

  async getViasComExposicaoMenorOuIgualE2 (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias(1);

    for (const via of vias) {
      if (via.imagem?.url) {
        via.imagem.url = adjustImageUrl(via.imagem.url);
      }
    }
    return vias.filter((via: Via) => via.exposicao?.toLowerCase() === 'e2' || via.exposicao?.toLowerCase() === 'e1');
  }
}

export default new HomeService();

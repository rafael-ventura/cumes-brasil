// src/services/HomeService.ts
import ViaService from './ViaService';

class HomeService {
  async getViasNaUrca () {
    const vias = await ViaService.getAllVias();
    return vias.filter(via => via.montanha?.bairro?.toLowerCase() === 'urca');
  }

  async getViasDeTerceiroGrau () {
    const vias = await ViaService.getAllVias();
    return vias.filter(via => via.grau?.toLowerCase().includes('3') || via.grau?.toLowerCase().includes('sup'));
  }

  async getViasComExposicaoMenorOuIgualE2 () {
    const vias = await ViaService.getAllVias();
    return vias.filter(via => via.exposicao?.toLowerCase() === 'e2' || via.exposicao?.toLowerCase() === 'e1');
  }
}

export default new HomeService();

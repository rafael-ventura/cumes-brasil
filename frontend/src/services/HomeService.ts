import ViaService from './ViaService';
import { Via } from 'src/models/Via';
import { romanToInt } from 'src/utils/utils';

class HomeService {
  async getViasEmCopa (): Promise<Via[]> {
    return this.getViasByBairro('copacabana');
  }

  async getViasNoBairro (bairro: string): Promise<Via[]> {
    return this.getViasByBairro(bairro.toLowerCase());
  }

  async getViasDeTerceiroGrau (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias();
    return vias.filter((via: Via) => this.isTerceiroGrau(via.grau));
  }

  async getViasComExposicaoMenorOuIgualE2 (): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias();
    return vias.filter((via: Via) => this.isExposicaoMenorOuIgual(via.exposicao, 'e2'));
  }

  // Método privado reutilizável para buscar vias por bairro
  private async getViasByBairro (bairro: string): Promise<Via[]> {
    const { vias } = await ViaService.getAllVias();
    return vias.filter((via: Via) => via.montanha?.bairro?.toLowerCase() === bairro);
  }

  // Método privado para verificar se a via é de terceiro grau
  private isTerceiroGrau (grau: string | undefined): boolean {
    if (!grau) return false;

    const grauInt = romanToInt(grau.toUpperCase());
    return grauInt === 3;
  }

  private isExposicaoMenorOuIgual (exposicao: string | undefined, maxExposicao: string): boolean {
    if (!exposicao) return false;

    const exposicaoValue = exposicao.toLowerCase();
    const maxValue = maxExposicao.toLowerCase();

    // Verifica se a exposição é menor ou igual à máxima desejada
    if (['e1', 'e2'].includes(exposicaoValue) && exposicaoValue <= maxValue) {
      return true;
    }

    return false;
  }
}

export default new HomeService();

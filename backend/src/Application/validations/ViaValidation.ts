import ValidationBase from "./ValidationBase";
import BadRequestError from "../errors/BadRequestError";

export default {
  validaController(filter: string): { key: string; value: string } {
    if (!filter || !filter.includes('=')) {
      throw new BadRequestError('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    const [key, value] = filter.split('=');

    if (!key || !value) {
      throw new BadRequestError('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    if (!['grau', 'bairro', 'exposicao', 'duracao'].includes(key)) {
      throw new BadRequestError('Filtro inválido. Use grau, bairro, exposicao ou duracao.');
    }

    return { key, value };
  },

  idParam(id: unknown) {
    return ValidationBase.idParam(id, 'id');
  },

  pagination(pageRaw?: unknown, limitRaw?: unknown): { page?: number; limit?: number } {
    return ValidationBase.pagination(pageRaw, limitRaw);
  },

  createBody(via: any) {
    ValidationBase.requireObject(via);
  },

  updateBody(via: any) {
    ValidationBase.requireIdOnBody(via);
  },
  validaValores(key: string, value: string): string | number {
    switch (key) {
      case 'grau': {
        const grauParsed = parseInt(value, 10);
        if (isNaN(grauParsed)) {
          throw new BadRequestError('O parâmetro "grau" deve ser um número válido.');
        }
        return grauParsed;
      }
      case 'bairro':
        return value.trim().toLowerCase();
      case 'exposicao': {
        const validExposicoes = ['E1', 'E2', 'E3', 'E4'];
        if (!validExposicoes.includes(value.toUpperCase())) {
          throw new BadRequestError('O parâmetro "exposicao" deve ser um dos valores válidos: E1, E2, E3, E4.');
        }
        return value.trim().toUpperCase();
      }
      case 'duracao': {
        if (!['D1', 'D2', 'D3', 'D4', 'D5'].includes(value.toUpperCase())) {
          throw new BadRequestError('O parâmetro "duracao" deve ser D1, D2, D3, D4 ou D5.');
        }
        return value.trim().toUpperCase();
      }
      default:
        throw new BadRequestError('Filtro inválido.');
    }
  },

  /**
   * Valida a estrutura física da via (montanha, face, setor)
   * Regra: A via deve estar em apenas UMA das três opções (setor, face ou montanha)
   * Prioridade: setor > face > montanha
   */
  validaEstruturaFisica(via: any): void {
    const temSetor = via.setor || via.setorId;
    const temFace = via.face || via.faceId;
    const temMontanha = via.montanha || via.montanhaId;

    const quantidadePreenchida = [temSetor, temFace, temMontanha].filter(Boolean).length;

    if (quantidadePreenchida === 0) {
      throw new BadRequestError('Via deve estar associada a uma montanha, face ou setor.');
    }

    if (quantidadePreenchida > 1) {
      throw new BadRequestError(
        'Via não pode estar associada a múltiplas estruturas físicas simultaneamente. ' +
        'Escolha apenas uma: setor, face ou montanha.'
      );
    }

    // Validações adicionais de consistência
    if (temSetor && temFace) {
      throw new BadRequestError('Via não pode estar em setor e face simultaneamente. Se estiver em setor, a face já está implícita.');
    }

    if (temSetor && temMontanha) {
      throw new BadRequestError('Via não pode estar em setor e montanha simultaneamente. Se estiver em setor, a montanha já está implícita.');
    }

    if (temFace && temMontanha) {
      throw new BadRequestError('Via não pode estar em face e montanha simultaneamente. Se estiver em face, a montanha já está implícita.');
    }
  }
};

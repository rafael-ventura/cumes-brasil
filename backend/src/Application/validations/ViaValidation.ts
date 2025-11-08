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
  }
};

export default {
  validaController(filter: string): { key: string; value: string } {
    if (!filter || !filter.includes('=')) {
      throw new Error('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    const [key, value] = filter.split('=');

    if (!key || !value) {
      throw new Error('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    return { key, value };
  },

  validaValores (key: string, value: string): string | number {
    switch (key) {
      case 'grau': {
        const grauParsed = parseInt(value, 10);
        if (isNaN(grauParsed)) {
          throw new Error('O parâmetro "grau" deve ser um número válido.');
        }
        return grauParsed;
      }
      case 'bairro': {
        return value.trim().toLowerCase();
      }
      case 'exposicao': {
        const exposicaoValue = value.trim().toUpperCase();
        const validExposicoes = ['E1', 'E2', 'E3','E4']; // Adapte conforme necessário
        if (!validExposicoes.includes(exposicaoValue)) {
          throw new Error('O parâmetro "exposicao" deve ser um dos valores válidos: E1, E2, E3 OU E4');
        }
        return exposicaoValue;
      }
      default:
        throw new Error('Filtro inválido. Use grau, bairro ou exposicao.');
    }
  }

};

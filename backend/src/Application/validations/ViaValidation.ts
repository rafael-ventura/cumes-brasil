export default {
  validaController(filter: string): { key: string; value: string } {
    if (!filter || !filter.includes('=')) {
      throw new Error('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    const [key, value] = filter.split('=');

    if (!key || !value) {
      throw new Error('Filtro inválido. Use o formato /count/:filter (ex: /count/bairro=copacabana).');
    }

    if (!['grau', 'bairro', 'exposicao', 'duracao'].includes(key)) {
      throw new Error('Filtro inválido. Use grau, bairro, exposicao ou duracao.');
    }

    return { key, value };
  },
  validaValores(key: string, value: string): string | number {
    switch (key) {
      case 'grau': {
        const grauParsed = parseInt(value, 10);
        if (isNaN(grauParsed)) {
          throw new Error('O parâmetro "grau" deve ser um número válido.');
        }
        return grauParsed;
      }
      case 'bairro':
        return value.trim().toLowerCase();
      case 'exposicao': {
        const validExposicoes = ['E1', 'E2', 'E3', 'E4'];
        if (!validExposicoes.includes(value.toUpperCase())) {
          throw new Error('O parâmetro "exposicao" deve ser um dos valores válidos: E1, E2, E3, E4.');
        }
        return value.trim().toUpperCase();
      }
      case 'duracao': {
        if (!['D1', 'D2', 'D3', 'D4', 'D5'].includes(value.toUpperCase())) {
          throw new Error('O parâmetro "duracao" deve ser D1, D2, D3, D4 ou D5.');
        }
        return value.trim().toUpperCase();
      }
      default:
        throw new Error('Filtro inválido.');
    }
  }
};

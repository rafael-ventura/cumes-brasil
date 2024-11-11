import { api } from 'boot/axios';
import { Montanha } from 'src/models/Montanha';
import { adjustImageUrls, handleApiError } from 'src/utils/utils';

export class MontanhaService {
  async getById (id: number | string): Promise<Montanha> {
    return this.fetchMontanha(`/montanhas/${id}`);
  }

  async getAll (): Promise<Montanha[]> {
    return this.fetchMontanhasCollection('/montanhas');
  }

  async getAllName (): Promise<string[]> {
    try {
      const montanhas = await this.fetchMontanhasCollection('/montanhas');
      return montanhas.map((montanha: Montanha) => montanha.nome);
    } catch (error: any) {
      handleApiError(error, 'Erro desconhecido ao buscar nomes de montanhas');
    }
  }

  private async fetchMontanha (url: string): Promise<Montanha> {
    try {
      const response = await api.get(url);
      const montanha = response.data as Montanha;

      adjustImageUrls(montanha.imagem);
      return montanha;
    } catch (error: any) {
      handleApiError(error, 'Erro desconhecido ao buscar montanha');
    }
  }

  private async fetchMontanhasCollection (url: string): Promise<Montanha[]> {
    try {
      const response = await api.get(url);
      const montanhas = response.data as Montanha[];

      montanhas.forEach(
        (montanha: Montanha) => adjustImageUrls(montanha.imagem)
      );
      return montanhas;
    } catch (error: any) {
      handleApiError(error, 'Erro desconhecido ao buscar montanhas');
    }
  }
}

export default new MontanhaService();

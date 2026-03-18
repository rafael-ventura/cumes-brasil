import { Service } from 'typedi';
import { LocalizacaoRepository } from '../../Infrastructure/repositories/LocalizacaoRepository';

@Service()
export class LocalizacaoService {
  constructor(
    private localizacaoRepository: LocalizacaoRepository
  ) {}

  async getLocationHierarchy(): Promise<any> {
    return this.localizacaoRepository.getLocationHierarchy();
  }

  async getStatsForExplorer(): Promise<any> {
    return this.localizacaoRepository.getStatsForExplorer();
  }
}

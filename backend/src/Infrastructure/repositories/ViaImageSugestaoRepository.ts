import { AppDataSource } from '../config/db';
import { ViaImageSugestao, StatusSugestao } from '../../Domain/entities/ViaImageSugestao';
import { ViaImagem } from '../../Domain/entities/ViaImagem';
import { Via } from '../../Domain/entities/Via';
import { Imagem } from '../../Domain/entities/Imagem';

export class ViaImageSugestaoRepository {
  private repo = AppDataSource.getRepository(ViaImageSugestao);

  async criar (sugestao: Partial<ViaImageSugestao>): Promise<ViaImageSugestao> {
    const nova = this.repo.create(sugestao);
    return this.repo.save(nova);
  }

  async listarPendentes (): Promise<ViaImageSugestao[]> {
    return this.repo.find({
      where: { status: 'pendente' },
      relations: ['via', 'imagem', 'usuario'],
      order: { created_at: 'ASC' }
    });
  }

  async listarTodas (): Promise<ViaImageSugestao[]> {
    return this.repo.find({
      relations: ['via', 'imagem', 'usuario', 'admin_revisor'],
      order: { created_at: 'DESC' }
    });
  }

  async listarAprovadaPorVia (viaId: number): Promise<ViaImageSugestao[]> {
    return this.repo.find({
      where: { via: { id: viaId }, status: 'aprovada' },
      relations: ['imagem', 'usuario'],
      order: { reviewed_at: 'ASC' }
    });
  }

  async buscarPorId (id: number): Promise<ViaImageSugestao | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['via', 'imagem', 'usuario', 'admin_revisor']
    });
  }

  async atualizar (id: number, dados: Partial<ViaImageSugestao>): Promise<void> {
    await this.repo.update(id, dados as any);
  }

  async contarPorStatus (status: StatusSugestao): Promise<number> {
    return this.repo.count({ where: { status } });
  }

  async criarViaImagem (via: Via, imagem: Imagem): Promise<void> {
    const viaImagemRepo = AppDataSource.getRepository(ViaImagem);
    const jaExiste = await viaImagemRepo.findOne({
      where: { via: { id: via.id }, imagem: { id: imagem.id } }
    });
    if (!jaExiste) {
      await viaImagemRepo.save(viaImagemRepo.create({ via, imagem }));
    }
  }
}

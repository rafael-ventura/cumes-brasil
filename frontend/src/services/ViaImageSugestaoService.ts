import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';
import type { IViaImageSugestao } from 'src/models/IViaImageSugestao';

class ViaImageSugestaoService {
  async submeterSugestao (viaId: number, arquivo: File, creditos?: string): Promise<IViaImageSugestao | undefined> {
    try {
      const formData = new FormData();
      formData.append('foto_via', arquivo);
      if (creditos?.trim()) formData.append('creditos', creditos.trim());
      const response = await api.post(`/vias/${viaId}/imagens/sugerir`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erro ao enviar sugestão de foto');
    }
  }

  async listarAprovadaPorVia (viaId: number): Promise<IViaImageSugestao[]> {
    try {
      const response = await api.get(`/vias/${viaId}/imagens/aprovadas`);
      return response.data;
    } catch {
      return [];
    }
  }

  // Endpoints de admin
  async listarTodasAdmin (): Promise<IViaImageSugestao[]> {
    try {
      const response = await api.get('/admin/sugestoes');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erro ao carregar sugestões');
      return [];
    }
  }

  async listarPendentesAdmin (): Promise<IViaImageSugestao[]> {
    try {
      const response = await api.get('/admin/sugestoes/pendentes');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erro ao carregar sugestões pendentes');
      return [];
    }
  }

  async aprovar (id: number): Promise<IViaImageSugestao | undefined> {
    try {
      const response = await api.patch(`/admin/sugestoes/${id}/aprovar`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erro ao aprovar sugestão');
    }
  }

  async rejeitar (id: number, motivo: string): Promise<IViaImageSugestao | undefined> {
    try {
      const response = await api.patch(`/admin/sugestoes/${id}/rejeitar`, { motivo });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erro ao rejeitar sugestão');
    }
  }
}

export default new ViaImageSugestaoService();

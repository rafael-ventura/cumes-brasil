import { api } from 'boot/axios';
import { Escalada } from 'src/models/Escalada';
import { handleApiError } from 'src/utils/utils';

class EscaladaService {
  async createEscalada (escalada: Escalada): Promise<void> {
    try {
      await api.post('/escaladas/', escalada);
    } catch (error: any) {
      handleApiError(error, 'Erro ao criar escalada');
    }
  }

  async getEscaladasByUsuario (): Promise<Escalada[]> {
    try {
      const usuario = localStorage.getItem('usuarioId');
      const response = await api.get('/escaladas/usuario?usuario=' + usuario);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar escaladas');
      return [];
    }
  }

  /**
   * @param como `autor` = registros criados pelo usuário; `marcado` = registros de terceiros em que ele foi incluído na cordada (qualquer papel, via username).
   */
  async listarPorUsuarioId (
    usuarioId: number,
    como: 'autor' | 'marcado' = 'autor'
  ): Promise<Escalada[]> {
    try {
      const sufixo = como === 'marcado' ? '&como=marcado' : '';
      const response = await api.get(`/escaladas/usuario?usuario=${usuarioId}${sufixo}`);
      return response.data;
    } catch {
      return [];
    }
  }

  /** Registros de outros em que este usuário foi marcado (guia, participante ou misto), não os que ele criou. */
  async listarOndeFoiMarcado (usuarioId: number): Promise<Escalada[]> {
    return this.listarPorUsuarioId(usuarioId, 'marcado');
  }

  async obterPorId (id: number): Promise<any> {
    const response = await api.get(`/escaladas/${id}`);
    return response.data;
  }

  async excluirPorId (id: number): Promise<void> {
    try {
      await api.delete(`/escaladas/${id}`);
    } catch (error: any) {
      handleApiError(error, 'Erro ao excluir escalada');
    }
  }

  async obterFeed (pagina: number, itensPorPagina: number): Promise<{ items: Escalada[]; totalPages: number; totalItems: number }> {
    const response = await api.get('/escaladas/feed', {
      params: { pagina, itensPorPagina }
    });
    return response.data;
  }
}

export default new EscaladaService();

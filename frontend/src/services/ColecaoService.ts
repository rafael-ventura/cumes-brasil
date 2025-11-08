import { api } from 'boot/axios';
import { IColecao } from 'src/models/IColecao';
import { Via } from 'src/models/Via';
import { adjustImageUrls, formatVia, handleApiError } from 'src/utils/utils';

class ColecaoService {
  async obterColecaoFavoritos (): Promise<IColecao | null> {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) throw new Error('Usuário não autenticado.');

      const colecoes = await this.listarColecoesPorUsuario();
      const colecaoFavoritos = colecoes.find(c => c.nome.includes('Favoritas') || c.nome === 'Vias Favoritas');
      return colecaoFavoritos || null;
    } catch (erro) {
      handleApiError(erro, 'Erro ao buscar coleção de favoritas.');
      return null;
    }
  }

  async listarColecoesPorUsuario (): Promise<IColecao[]> {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      return await this.buscarColecoes(`/colecoes/usuario/${usuarioId}`);
    } catch (erro) {
      handleApiError(erro, 'Erro ao listar coleções do usuário.');
      return [];
    }
  }

  async buscarColecaoPorId (id: number): Promise<IColecao | null> {
    try {
      return await this.buscarColecao(`/colecoes/${id}`);
    } catch (erro) {
      handleApiError(erro, 'Erro ao buscar coleção pelo ID.');
      return null;
    }
  }

  async criarColecao (dados: IColecao): Promise<void> {
    try {
      await api.post('/colecoes', dados);
    } catch (erro) {
      handleApiError(erro, 'Erro ao criar coleção.');
    }
  }

  async atualizarColecao (id: number, dados: { nome: string; descricao: string }): Promise<void> {
    try {
      await api.put(`/colecoes/${id}`, dados);
    } catch (erro) {
      handleApiError(erro, 'Erro ao atualizar coleção.');
    }
  }

  async excluirColecao (id: number): Promise<void> {
    try {
      await api.delete(`/colecoes/${id}`);
    } catch (erro) {
      handleApiError(erro, 'Erro ao excluir coleção.');
    }
  }

  async listarViasNaColecao (colecaoId: number): Promise<Via[]> {
    try {
      return await this.buscarVias(`/vias/colecao/${colecaoId}`);
    } catch (erro) {
      handleApiError(erro, 'Erro ao listar vias na coleção.');
      return [];
    }
  }

  async listarViasForaDaColecao (
    colecaoId: number,
    pagina: number,
    limite = 10
  ): Promise<{ vias: Via[]; total: number }> {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      const resposta = await api.get(`/vias/colecao/not/${colecaoId}`, {
        params: {
          page: pagina,
          limit: limite,
          usuarioId
        }
      });
      const vias = resposta.data.items.map(formatVia);
      vias.forEach((via: any) => adjustImageUrls(via.imagem));
      return {
        vias,
        total: resposta.data.total
      };
    } catch (erro) {
      handleApiError(erro, 'Erro ao listar vias fora da coleção.');
      return {
        vias: [],
        total: 0
      };
    }
  }

  async adicionarViaNaColecao (colecaoId: number, viaId: number): Promise<void> {
    try {
      await api.post('/colecoes/adicionarVia', null, {
        params: {
          colecao_id: colecaoId,
          via_id: viaId
        }
      });
    } catch (erro) {
      handleApiError(erro, 'Erro ao adicionar via na coleção.');
    }
  }

  async removerViaDaColecao (colecaoId: number, viaId: number): Promise<void> {
    try {
      await api.post('/colecoes/removerVia', null, {
        params: {
          colecao_id: colecaoId,
          via_id: viaId
        }
      });
    } catch (erro) {
      handleApiError(erro, 'Erro ao remover via da coleção.');
    }
  }

  async listarColecoesSemVia (
    viaId: number,
    pagina: number,
    limite: number
  ): Promise<{ colecoes: IColecao[]; total: number }> {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) throw new Error('Usuário não autenticado.');

      const resposta = await api.get(`/colecoes/not-containing-via/${viaId}`, {
        params: {
          usuarioId,
          page: pagina,
          limit: limite
        }
      });

      resposta.data.colecoes.forEach(adjustImageUrls);
      return resposta.data;
    } catch (erro) {
      handleApiError(erro, 'Erro ao listar coleções sem a via.');
      return {
        colecoes: [],
        total: 0
      };
    }
  }

  private async buscarColecao (url: string): Promise<IColecao | null> {
    try {
      const resposta = await api.get(url);
      const colecao = resposta.data;
      if (colecao.imagem) adjustImageUrls(colecao.imagem);
      return colecao;
    } catch (erro) {
      handleApiError(erro, 'Erro ao buscar coleção.');
      return null;
    }
  }

  private async buscarColecoes (url: string): Promise<IColecao[]> {
    try {
      const resposta = await api.get(url);
      const colecoes = resposta.data;
      colecoes.forEach((c: IColecao) => c.imagem && adjustImageUrls(c.imagem));
      return colecoes;
    } catch (erro) {
      handleApiError(erro, 'Erro ao buscar coleções.');
      return [];
    }
  }

  private async buscarVias (url: string): Promise<Via[]> {
    try {
      const resposta = await api.get(url);
      const vias = resposta.data.vias.map(formatVia);
      vias.forEach((via: any) => adjustImageUrls(via.imagem));
      return vias;
    } catch (erro) {
      handleApiError(erro, 'Erro ao buscar vias.');
      return [];
    }
  }
}

export default new ColecaoService();

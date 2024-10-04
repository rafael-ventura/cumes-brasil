import { api } from 'boot/axios';
import { Usuario } from 'src/models/Usuario';
import { adjustImageUrls, handleApiError } from 'src/utils/utils';

class UsuarioService {
  async getById (id: number): Promise<Usuario> {
    try {
      const response = await api.get(`/usuarios/${id}`);
      const usuario = response.data as Usuario;

      // Ajustando URL da imagem do perfil do usuário
      if (usuario.foto_perfil) {
        adjustImageUrls({ imagem: usuario.foto_perfil });
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar usuário');
    }
  }

  async getAll (): Promise<Usuario[]> {
    try {
      const response = await api.get('/usuarios');
      const usuarios = response.data as Usuario[];

      // Ajustando URLs das imagens dos usuários
      usuarios.forEach(usuario => {
        if (usuario.foto_perfil) {
          adjustImageUrls({ imagem: usuario.foto_perfil });
        }
      });

      return usuarios;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar usuários');
    }
  }

  async create (nome: string, email: string, password: string): Promise<Usuario> {
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        password
      });
      const usuario = response.data as Usuario;

      if (usuario.foto_perfil) {
        adjustImageUrls({ imagem: usuario.foto_perfil });
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao criar usuário');
    }
  }

  async getPerfil (): Promise<Usuario> {
    try {
      const response = await api.get('/perfil');
      const usuario = response.data as Usuario;

      if (usuario.foto_perfil) {
        adjustImageUrls({ imagem: usuario.foto_perfil });
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar perfil');
    }
  }

  async update (id: number, updatedUser: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await api.put(`/usuarios/${id}`, updatedUser);
      const usuario = response.data as Usuario;

      if (usuario.foto_perfil) {
        adjustImageUrls({ imagem: usuario.foto_perfil });
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar usuário');
    }
  }

  async editarDados (usuario: {
    localizacao: string | null;
    via_preferida: { id: number | string } | null;
    data_atividade: string | null;
    biografia: string | null;
    foto_perfil: { url: string } | null;
    nome: string;
    clube_organizacao: string | null;
    email: string;
  }) {
    try {
      const response = await api.put('/perfil', usuario);
      return response.data as Usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar dados');
    }
  }

  async editarBio (biografia: string) {
    try {
      const response = await api.put('/perfil', { biografia });
      return response.data as Usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar biografia');
    }
  }

  logout (): void {
    localStorage.removeItem('authToken');
  }
}

export default new UsuarioService();

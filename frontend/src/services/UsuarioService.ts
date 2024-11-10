import { api } from 'boot/axios';
import { IUsuario } from 'src/models/IUsuario';
import { adjustImageUrls, handleApiError } from 'src/utils/utils';

class UsuarioService {
  async getById (id: number): Promise<IUsuario> {
    try {
      const response = await api.get(`/usuarios/${id}`);
      const usuario = response.data as IUsuario;

      // Ajustando URL da imagem do perfil do usuário
      if (usuario.foto_perfil) {
        adjustImageUrls(usuario.foto_perfil);
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar usuário');
    }
  }

  async getAll (): Promise<IUsuario[]> {
    try {
      const response = await api.get('/usuarios');
      const usuarios = response.data as IUsuario[];

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

  async create (nome: string, email: string, password: string): Promise<IUsuario> {
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        password
      });
      const usuario = response.data as IUsuario;

      if (usuario.foto_perfil) {
        adjustImageUrls(usuario.foto_perfil);
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao criar usuário');
    }
  }

  async getPerfil (): Promise<IUsuario> {
    try {
      const response = await api.get('/perfil');
      const usuario = response.data as IUsuario;

      if (usuario.foto_perfil) {
        adjustImageUrls(usuario.foto_perfil);
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao buscar perfil');
    }
  }

  async update (id: number, updatedUser: Partial<IUsuario>): Promise<IUsuario> {
    try {
      const response = await api.put(`/usuarios/${id}`, updatedUser);
      const usuario = response.data as IUsuario;

      if (usuario.foto_perfil) {
        adjustImageUrls(usuario.foto_perfil);
      }

      return usuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar usuário');
    }
  }

  async editarDados (formData: FormData) {
    try {
      const response = await api.put('/perfil', formData);
      if (response.data.foto_perfil) {
        adjustImageUrls(response.data.foto_perfil);
      }
      return response.data as IUsuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar dados');
    }
  }

  async editarBio (biografia: string) {
    try {
      const response = await api.put('/perfil', { biografia });
      return response.data as IUsuario;
    } catch (error: any) {
      handleApiError(error, 'Erro ao atualizar biografia');
    }
  }

  logout (): void {
    localStorage.removeItem('authToken');
  }
}

export default new UsuarioService();

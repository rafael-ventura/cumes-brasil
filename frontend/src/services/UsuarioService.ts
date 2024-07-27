// src/services/UsuarioService.ts

import { api } from 'boot/axios';
import { Usuario } from 'src/models/Usuario';
import { adjustImageUrl } from 'src/services/ImagemService';

class UsuarioService {
  async getById (id: number) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data as Usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar usuário');
    }
  }

  async getAll () {
    try {
      const response = await api.get('/usuarios');
      return response.data as Usuario[];
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar usuários');
    }
  }

  async create (nome: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        password
      });
      return response.data as Usuario;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Erro desconhecido ao criar usuário');
      }
    }
  }

  async getPerfil () {
    try {
      const response = await api.get('/perfil');
      const usuario = response.data as Usuario;
      if (usuario.foto_perfil?.url) {
        usuario.foto_perfil.url = adjustImageUrl(usuario.foto_perfil.url);
      }
      return usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar perfil');
    }
  }

  async update (usuario: Usuario) {
    try {
      const response = await api.put(`/usuarios/${usuario.id}`, usuario);
      return response.data as Usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao atualizar usuário');
    }
  }

  logout () {
    localStorage.removeItem('authToken');
  }
}

export default new UsuarioService();

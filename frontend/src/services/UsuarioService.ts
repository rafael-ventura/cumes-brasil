// src/services/UsuarioService.ts

import { api } from 'boot/axios';
import { Usuario } from 'src/models/Usuario';
import { getFullImageUrl } from 'src/services/ImagemService';

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
        usuario.foto_perfil.url = getFullImageUrl(usuario.foto_perfil.url);
      }
      return usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar perfil');
    }
  }

  async update (id: number, updatedUser: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await api.put(`/usuarios/${id}`, updatedUser);
      return response.data as Usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao atualizar usuário');
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
      throw new Error(error.response.data.error || 'Erro desconhecido ao editar dados');
    }
  }

  async editarBio (biografia: string) {
    try {
      const response = await api.put('/perfil', { biografia });
      return response.data as Usuario;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao editar biografia');
    }
  }

  logout () {
    localStorage.removeItem('authToken');
  }
}

export default new UsuarioService();

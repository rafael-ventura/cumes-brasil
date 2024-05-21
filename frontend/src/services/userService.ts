// services/userService.ts

import { api } from 'boot/axios'

class UserService {
  async getById (id: number) {
    try {
      const response = await api.get(`/usuarios/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar usuario')
    }
  }

  async getAll () {
    try {
      const response = await api.get('/usuarios')
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar usuario')
    }
  }

  async create (nome: string, email: string, password: string) {
    try {
      const response = await api.post('/register', {
        nome,
        email,
        password
      })
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error('Erro desconhecido ao criar usuario')
      }
    }
  }

  async getPerfil () {
    try {
      const response = await api.get('/perfil', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Erro desconhecido ao buscar usuario')
    }
  }
}

export default new UserService()

import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';
import { Router } from 'vue-router';

interface TokenPayload {
  exp: number;
  userId: string;
  email: string;
}

class AuthenticateService {
  async login (email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      this.saveToken(response.data);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  async authenticateWithGoogle (authorizationCode: string) {
    try {
      const response = await api.post('/auth/google-login', { authorizationCode });
      this.saveToken(response.data);
      return response;
    } catch (error) {
      handleApiError(error, 'Erro ao fazer login com Google');
    }
  }

    async register (nome: string, email: string, senha: string) {
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha
      });
      this.saveToken(response.data);
      return response;
    } catch (error) {
      handleApiError(error, 'Erro ao criar usuário');
    }
  }

  async generateUserResetPassword (email: string) {
    try {
      return await api.post('/auth/generate-reset-password', { email });
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  async resetPassword (password: string, passwordRepeated: string, token: string) {
    try {
      return await api.put(`/auth/reset-password/${token}`, {
        password,
        passwordRepeated
      });
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  // Valida se o token existe e não está expirado
  isTokenValid (): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      if (!payload) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  // Decodifica o token JWT (sem verificar assinatura)
  private decodeToken (token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  async redirecionaSeNaoAutenticado (router: Router): Promise<void> {
    if (!this.isTokenValid()) {
      await router.push('/auth/login');
    }
  }

  logout (): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioId');
  }

  private saveToken (token: { token: string; usuarioId: string } | string): void {
    if (typeof token === 'string') {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.setItem('authToken', token.token);
      localStorage.setItem('usuarioId', token.usuarioId);
    }
  }
}

export default new AuthenticateService();

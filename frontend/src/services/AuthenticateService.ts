import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';
import Router from 'src/router';

class AuthenticateService {
  async login (email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      this.saveToken(response.data.token);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  async authenticateWithGoogle (authorizationCode: string) {
    try {
      const response = await api.post('/auth/google-login', { authorizationCode });
      this.saveToken(response.data); // Salva o JWT gerado no backend
      return response;
    } catch (error) {
      handleApiError(error, 'Erro ao fazer login com Google');
    }
  }

  async register (nome: string, email: string, senha: string) {
    try {
      return await api.post('/auth/register', {
        nome,
        email,
        senha
      });
    } catch (error) {
      handleApiError(error, 'Erro ao criar usuário');
    }
  }

  async generateUserResetPassword (email: string) {
    console.log("chamando", email)
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

  // @ts-ignore
  async redirecionaSeNaoAutenticado (router: Router): Promise<void> {
    if (localStorage.getItem('authToken') === null || localStorage.getItem('authToken') === '') {
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

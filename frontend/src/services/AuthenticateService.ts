import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';

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

  // TODO: Implementar autenticação com Google
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
    try {
      return await api.post('/usuarios/generate-reset-password', { email });
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  async resetPassword (password: string, passwordRepeated: string, token: string) {
    try {
      return await api.put(`/usuarios/reset-password/${token}`, {
        password,
        passwordRepeated
      });
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message);
    }
  }

  isAuthenticated (): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
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

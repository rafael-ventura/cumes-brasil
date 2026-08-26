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

  async autenticarComGoogle (authorizationCode: string) {
    try {
      const response = await api.post('/auth/google-login', { authorizationCode });
      this.saveToken(response.data);
      return response;
    } catch (error) {
      handleApiError(error, 'Erro ao fazer login com Google');
    }
  }

    async register (nome: string, email: string, senha: string, username?: string) {
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha,
        username
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

  /** Redireciona para o login se não autenticado. Retorna true se redirecionou (caller deve abortar a ação). */
  async redirecionaSeNaoAutenticado (router: Router): Promise<boolean> {
    if (!this.isTokenValid()) {
      await router.push('/auth/login');
      return true;
    }
    return false;
  }

  getUsername (): string | null {
    return localStorage.getItem('username');
  }

  /** Papel do usuário logado (dica de UI; a autorização real é sempre no backend). */
  getRole (): string {
    return localStorage.getItem('role') || 'usuario';
  }

  /** True se o papel atual for um dos informados. Ex.: temPapel('admin', 'moderador'). */
  temPapel (...papeis: string[]): boolean {
    return papeis.includes(this.getRole());
  }

  isAdmin (): boolean {
    // is_admin (compat) ou role === admin — qualquer um basta como dica de UI.
    return localStorage.getItem('is_admin') === 'true' || this.getRole() === 'admin';
  }

  isModerador (): boolean {
    return this.temPapel('moderador', 'admin');
  }

  /**
   * Atualiza role/is_admin (e username) no localStorage a partir de GET /perfil.
   * Necessário após seed ou mudança de permissão sem novo login.
   */
  async sincronizarPrivilegiosSessao (): Promise<void> {
    if (!this.isTokenValid()) return;
    try {
      const response = await api.get('/perfil');
      const dados = response.data;
      if (dados?.username) {
        localStorage.setItem('username', dados.username);
      }
      if (dados?.role) {
        localStorage.setItem('role', String(dados.role));
      }
      localStorage.setItem('is_admin', String(Boolean(dados?.is_admin)));
    } catch {
      // Mantém valores atuais se a API falhar
    }
  }

  logout (): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('is_admin');
  }

  private saveToken (token: { token: string; usuarioId: string; username?: string; role?: string; is_admin?: boolean } | string): void {
    if (typeof token === 'string') {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.setItem('authToken', token.token);
      localStorage.setItem('usuarioId', token.usuarioId);
      if (token.username) {
        localStorage.setItem('username', token.username);
      }
      localStorage.setItem('role', String(token.role ?? 'usuario'));
      localStorage.setItem('is_admin', String(token.is_admin ?? false));
    }
  }
}

export default new AuthenticateService();

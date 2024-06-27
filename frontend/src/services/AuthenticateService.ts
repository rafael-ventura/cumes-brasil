import { api } from "boot/axios";

class AuthenticateService {
  async login (email: string, password: string) {
    try {
      console.log("o caminho do endpoint eh", api.defaults.baseURL);
      console.log("o caminho do endpoint eh", api.name);
      const response = await api.post("/auth/login", {
        email,
        password
      });
      // Salvar token de autenticação, se houver
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token.token);
        localStorage.setItem("userId", response.data.token.userId);
      }
      return response;
    } catch (error) {
      throw new Error("Erro ao fazer login: " + error);
    }
  }

  async authenticateWithGoogle (googleTokenId: string) {
    try {
      const response = await api.post("/auth/google-login", { token: googleTokenId });
      // Salvar token de autenticação, se houver
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return response;
    } catch (error) {
      throw new Error("Erro ao autenticar com o Google: " + error);
    }
  }

  async register (nome: string, email: string, senha: string) {
    try {
      console.log("o caminho do endpoint eh", api.defaults.baseURL);
      console.log("o caminho do endpoint eh", api.name);
      return await api.post("/auth/register", {
        nome,
        email,
        senha
      });
    } catch (error) {
      throw new Error("Erro ao fazer cadastro: " + error);
    }
  }

  async resetPassword (email: string) {
    try {
      return await api.post("/auth/reset-password", { email });
    } catch (error) {
      throw new Error("Erro ao redefinir senha: " + error);
    }
  }

  logout () {
    localStorage.removeItem("authToken");
  }

  isAuthenticated () {
    const token = localStorage.getItem("authToken");
    return !!token;
  }
}

export default new AuthenticateService();

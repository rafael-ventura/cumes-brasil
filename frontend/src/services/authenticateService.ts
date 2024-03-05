// authenticateService.ts

import apiClient from "./apiService";

class AuthenticateService {
  async login (email: string, password: string) {
    try {
      return await apiClient.post("/login", { email, password }); // Retorna a resposta completa
    } catch (error) {
      throw new Error("Erro ao fazer login: " + error);
    }
  }

  logout () {
    localStorage.removeItem("authToken");
  }

  isAuthenticated () {
    const token = localStorage.getItem("authToken");
    console.log(!!token);
    return !!token;
  }
}

export default new AuthenticateService();

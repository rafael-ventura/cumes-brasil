// authenticateService.ts

import apiClient from "./apiService";
import { ref, watchEffect } from "vue";

class AuthenticateService {
  isAuthenticated = ref(false);

  async login (email: string, password: string) {
    try {
      const response = await apiClient.post("/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        this.checkAuthState();
      }
      return response;
    } catch (error) {
      throw new Error("Erro ao fazer login: " + error);
    }
  }

  async authenticateWithGoogle (googleTokenId: string) {
    try {
      const response = await apiClient.post("/google-login", { token: googleTokenId });
      if (response.status === 200) {
        this.isAuthenticated.value = true;
      }
      return response;
    } catch (error) {
      throw new Error("Erro ao autenticar com o Google: " + error);
    }
  }

  logout () {
    localStorage.removeItem("authToken");
    this.isAuthenticated.value = false;
  }

  checkAuthState () {
    const token = localStorage.getItem("authToken");
    this.isAuthenticated.value = !!token;
  }

  watchAuthStateChange (callback: (newAuthState: boolean) => void) {
    watchEffect(() => {
      callback(this.isAuthenticated.value);
    });
  }
}

const authenticateService = new AuthenticateService();
authenticateService.checkAuthState();

export default new AuthenticateService();

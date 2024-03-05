import apiClient from "./apiService";

class UserService {
  async getById (id: number) {
    try {
      const response = await apiClient.get(`/usuarios/${id}`);
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar usuario");
    }
  }

  async getAll () {
    try {
      const response = await apiClient.get("/usuarios");
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar usuario");
    }
  }

  async create (nome: string, email: string, password: string) {
    try {
      const response = await apiClient.post("/register", { nome, email, password });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao registrar: " + error);
    }
  }
}

export default UserService;

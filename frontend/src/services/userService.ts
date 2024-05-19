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
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        throw error.response.data.error;
      } else {
        console.log("Erro desconhecido ao criar usuario", error);
        throw error;
      }
    }
  }

  async getPerfil () {
    try {
      const response = await apiClient.get(`/perfil`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      return response.data;
    } catch (error: any) { // Definindo o tipo como 'any'
      throw new Error(error.response.data.error || "Erro desconhecido ao buscar usuario");
    }
  }
}

export default new UserService();

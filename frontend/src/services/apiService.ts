// src/services/apiService.ts

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000", // Coloque a URL base da sua API aqui
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiClient;

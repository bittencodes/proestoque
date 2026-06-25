import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


// Substitua 192.168.0.111 pelo seu IP
const BASE_URL = __DEV__
  ? "http://192.168.0.111:3333/api"   
  : "https://sua-api-em-producao.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: adiciona o token JWT automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: trata 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado → redirecionar para login (Aula 11 vamos implementar)
      console.log("Sessão expirada. Faça login novamente.");
    }
    return Promise.reject(error);
  }
);
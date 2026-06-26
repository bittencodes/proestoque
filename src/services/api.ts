// src/services/api.ts
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

// ── INTERCEPTOR DE REQUEST (adiciona token) ──────────────
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── INTERCEPTOR DE RESPONSE (refresh token) ──────────────
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se não for 401 ou já tentou refresh, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já está fazendo refresh, coloca a requisição na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem("@proestoque:refreshToken");

      if (!refreshToken) {
        throw new Error("Sem refresh token");
      }

      // Chama o endpoint de refresh
      const response = await api.post("/auth/refresh", { refreshToken });
      const { token: novoToken } = response.data;

      // Salva o novo token
      await AsyncStorage.setItem("@proestoque:token", novoToken);

      // Atualiza o header da requisição original
      originalRequest.headers.Authorization = `Bearer ${novoToken}`;

      // Processa a fila de requisições pendentes
      processQueue(null, novoToken);

      return api(originalRequest);
    } catch (refreshError) {
      // Se o refresh falhar, limpa tudo e força logout
      processQueue(refreshError, null);
      await AsyncStorage.multiRemove([
        "@proestoque:token",
        "@proestoque:user",
        "@proestoque:refreshToken",
      ]);
      // Redirecionar para login (o AuthContext já vai detectar que não tem token)
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
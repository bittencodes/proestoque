// src/services/api.ts (com Refresh Token)
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = (Constants.expoConfig?.extra?.apiUrl as string)
  ?? "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request: adiciona JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor de response com Refresh Token ──────────────
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

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

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
      if (!refreshToken) throw new Error("Sem refresh token");

      const response = await api.post("/auth/refresh", { refreshToken });
      const { token: novoToken } = response.data;

      await AsyncStorage.setItem("@proestoque:token", novoToken);
      originalRequest.headers.Authorization = `Bearer ${novoToken}`;

      processQueue(null, novoToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await AsyncStorage.multiRemove([
        "@proestoque:token",
        "@proestoque:user",
        "@proestoque:refreshToken",
      ]);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
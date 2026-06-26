import { api } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
const [refreshToken, setRefreshToken] = useState<string | null>(null);

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>; 
};

const STORAGE_KEYS = {
  TOKEN: "@proestoque:token",
  USER: "@proestoque:user",
  REFRESH_TOKEN: "@proestoque:refreshToken",
} as const;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [tokenSalvo, userString] = await AsyncStorage.multiGet([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER,
          STORAGE_KEYS.REFRESH_TOKEN,
        ]);

        const token = tokenSalvo[1];
        const user = userString[1] ? JSON.parse(userString[1]) : null;

        if (token && user) {
          setToken(token);
          setUser(user);
        }
      } catch (error) {
        console.warn("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessao();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken ?? ""],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? "Erro ao fazer login";
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/registro", { nome, email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken ?? ""],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? "Erro ao criar conta";
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER,STORAGE_KEYS.REFRESH_TOKEN,]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        registrar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}
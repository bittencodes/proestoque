import type { ProdutoFormData } from "@/src/schemas/produtoSchema";
import { api } from "@/src/services/api";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// ── TIPOS ────────────────────────────────────────────────────
export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  categoriaId: string;
  categoria?: { id: string; nome: string; icone: string; cor: string };
  ultimaMovimentacao: string;
  criadoEm: string;
  foto?: string | null;
};

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Produto[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

// ── REDUCER ──────────────────────────────────────────────────
function reducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { produtos: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case "UPDATE":
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE":
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextType | null>(null);

// ── PROVIDER ─────────────────────────────────────────────────
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    produtos: [],
    isLoading: false,
    error: null,
  });

  // ── CARREGAR PRODUTOS DA API ─────────────────────────────
  const carregarProdutos = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const { data } = await api.get<Produto[]>("/produtos");
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (error: any) {
      dispatch({ type: "LOAD_ERROR", payload: error.message });
    }
  }, []);

  // Carrega ao montar o provider
  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // ── CRUD ──────────────────────────────────────────────────
  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const { data: novo } = await api.post<Produto>("/produtos", data);
    dispatch({ type: "ADD", payload: novo });
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const { data: atualizado } = await api.put<Produto>(`/produtos/${id}`, data);
    dispatch({ type: "UPDATE", payload: atualizado });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((p) => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        error: state.error,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        deletarProduto,
        getProdutoById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }
  return context;
}
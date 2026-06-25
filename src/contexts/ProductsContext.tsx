import { PRODUTOS_MOCK, type Produto } from "@/src/data/mockData";
import type { ProdutoFormData } from "@/src/schemas/produtoSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: "LOAD"; payload: Produto[] }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

const STORAGE_KEY = "@proestoque:produtos";

function produtosReducer(
  state: ProductsState,
  action: ProductsAction
): ProductsState {
  switch (action.type) {
    case "LOAD":
      return { ...state, produtos: action.payload, isLoading: false };
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

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: true,
  });

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const produtos = json ? JSON.parse(json) : PRODUTOS_MOCK;
        dispatch({ type: "LOAD", payload: produtos });
      } catch {
        dispatch({ type: "LOAD", payload: PRODUTOS_MOCK });
      }
    }
    carregarProdutos();
  }, []);

  const persistir = useCallback(async (produtos: Produto[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }, []);

  const adicionarProduto = useCallback(
    async (data: ProdutoFormData) => {
      const novoProduto: Produto = {
        ...data,
        id: "prod_" + Date.now(),
        ultimaMovimentacao: new Date().toISOString(),
        observacao: data.observacao ?? "", 
      };
      dispatch({ type: "ADD", payload: novoProduto });
      await persistir([novoProduto, ...state.produtos]);
    },
    [state.produtos, persistir]
  );

  const editarProduto = useCallback(
    async (id: string, data: ProdutoFormData) => {
      const produtoAtualizado: Produto = {
        ...data,
        id,
        ultimaMovimentacao: new Date().toISOString(),
        observacao: data.observacao ?? "", 
      };
      dispatch({ type: "UPDATE", payload: produtoAtualizado });
      await persistir(
        state.produtos.map((p) => (p.id === id ? produtoAtualizado : p))
      );
    },
    [state.produtos, persistir]
  );

  const deletarProduto = useCallback(
    async (id: string) => {
      dispatch({ type: "DELETE", payload: id });
      await persistir(state.produtos.filter((p) => p.id !== id));
    },
    [state.produtos, persistir]
  );

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((p) => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
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
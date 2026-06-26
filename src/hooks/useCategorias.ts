import { api } from "@/src/services/api";
import { useEffect, useState } from "react";

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<Categoria[]>("/categorias")
      .then(({ data }) => setCategorias(data))
      .catch(() => {}) // Silencia erro – categorias são opcionais
      .finally(() => setIsLoading(false));
  }, []);

  return { categorias, isLoading };
}
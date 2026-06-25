import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(80, { message: "Nome muito longo" }),

  categoriaId: z
    .string()
    .min(1, { message: "Selecione uma categoria" }),

  quantidade: z
    .number({ message: "Informe a quantidade" })
    .min(0, { message: "Quantidade não pode ser negativa" }),

  quantidadeMinima: z
    .number({ message: "Informe a quantidade mínima" })
    .min(0, { message: "Não pode ser negativa" }),

  preco: z
    .number({ message: "Informe o preço" })
    .positive({ message: "Preço deve ser maior que zero" }),

  unidade: z.enum(["un", "kg", "cx", "L", "m"]),

  observacao: z.string().max(200, { message: "Máximo 200 caracteres" }).optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
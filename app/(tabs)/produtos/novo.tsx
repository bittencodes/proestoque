import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useProducts } from "@/src/contexts/ProductsContext";
import { CATEGORIAS_MOCK } from "@/src/data/mockData";
import { produtoSchema, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView as RNScrollView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NovoProduto() {
  const { adicionarProduto } = useProducts();
  const [precoText, setPrecoText] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      categoriaId: "",
      quantidade: undefined,
      quantidadeMinima: undefined,
      preco: undefined,
      unidade: "un",
      observacao: "",
    },
  });

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      await adicionarProduto(data);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        control={control}
        name="nome"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nome do produto *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nome?.message}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="categoriaId"
        render={({ field: { value, onChange, onBlur } }) => (
          <View>
            <Text style={styles.label}>Categoria *</Text>
            <RNScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {CATEGORIAS_MOCK.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    value === cat.id && styles.chipAtivo,
                    { borderColor: value === cat.id ? cat.cor : Colors.border },
                  ]}
                  onPress={() => {
                    onChange(cat.id);
                    onBlur();
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      value === cat.id && styles.chipTextoAtivo,
                    ]}
                  >
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </RNScrollView>
            {errors.categoriaId && (
              <Text style={styles.errorText}>{errors.categoriaId.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="quantidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Quantidade em estoque *"
            value={value === undefined || value === 0 ? "" : String(value)}
            onChangeText={(t) => {
              if (t === "") {
                onChange(undefined);
              } else {
                const num = Number(t);
                onChange(isNaN(num) ? undefined : num);
              }
            }}
            onBlur={onBlur}
            error={errors.quantidade?.message}
            keyboardType="numeric"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="quantidadeMinima"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Quantidade mínima (alerta) *"
            value={value === undefined || value === 0 ? "" : String(value)}
            onChangeText={(t) => {
              if (t === "") {
                onChange(undefined);
              } else {
                const num = Number(t);
                onChange(isNaN(num) ? undefined : num);
              }
            }}
            onBlur={onBlur}
            error={errors.quantidadeMinima?.message}
            keyboardType="numeric"
            returnKeyType="next"
            hint="Abaixo disso, aparece o alerta de estoque baixo"
          />
        )}
      />

      <Controller
        control={control}
        name="preco"
        render={({ field: { value, onChange, onBlur } }) => {
          if (value !== undefined && value !== 0 && String(value) !== precoText.replace(",", ".")) {
            const textValue = String(value).replace(".", ",");
            if (precoText !== textValue) {
              setPrecoText(textValue);
            }
          }

          return (
            <Input
              label="Preço (R$) *"
              value={precoText}
              onChangeText={(text) => {
                // Permite apenas números, vírgula e ponto
                const cleaned = text.replace(/[^0-9,.]/g, "");
                // Impede múltiplas vírgulas/pontos
                const parts = cleaned.split(/[,.]/);
                if (parts.length > 2) return;
                setPrecoText(cleaned);
              }}
              onBlur={() => {               
                const normalized = precoText.replace(",", ".");
                if (normalized === "" || normalized === ".") {
                  onChange(undefined);
                } else {
                  const num = parseFloat(normalized);
                  if (!isNaN(num)) {
                    onChange(num);
                  } else {
                    onChange(undefined);
                  }
                }
                onBlur();
              }}
              error={errors.preco?.message}
              keyboardType="numeric"
              returnKeyType="next"
              placeholder="0,00"
            />
          );
        }}
      />

      <Controller
        control={control}
        name="unidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <View>
            <Text style={styles.label}>Unidade *</Text>
            <View style={styles.unidadeContainer}>
              {["un", "kg", "cx", "L", "m"].map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.unidadeOption,
                    value === u && styles.unidadeOptionSelected,
                  ]}
                  onPress={() => {
                    onChange(u as any);
                    onBlur();
                  }}
                >
                  <Text
                    style={[
                      styles.unidadeOptionText,
                      value === u && styles.unidadeOptionTextSelected,
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.unidade && (
              <Text style={styles.errorText}>{errors.unidade.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Observação (opcional)"
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.observacao?.message}
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      <Button
        label="Cadastrar produto"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth
        style={{ marginTop: Spacing[4] }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[6], paddingBottom: Spacing[10] },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  chipsContainer: {
    flexDirection: "row",
    gap: Spacing[2],
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
  },
  chipAtivo: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextoAtivo: { color: Colors.white },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    marginTop: Spacing[1],
  },
  unidadeContainer: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
  },
  unidadeOption: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  unidadeOptionSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  unidadeOptionText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
  },
  unidadeOptionTextSelected: {
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.semibold,
  },
});
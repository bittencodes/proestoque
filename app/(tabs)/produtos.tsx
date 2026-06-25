import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing, Typography } from "../../src/constants/theme";
import {
  CATEGORIAS_MOCK,
  getCategoriaPorId,
  PRODUTOS_MOCK,
  type Produto,
} from "../../src/data/mockData";

type Secao = {
  title: string;
  categoriaId: string;
  data: Produto[];
  cor: string;
  icone: string;
};

export default function ProdutosScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [modoAgrupado, setModoAgrupado] = useState(false);

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((produto) => {
      const buscaNome = produto.nome
        .toLowerCase()
        .includes(busca.toLowerCase().trim());

      const buscaCategoria = categoriaAtiva
        ? produto.categoriaId === categoriaAtiva
        : true;

      return buscaNome && buscaCategoria;
    });
  }, [busca, categoriaAtiva]);

  const secoesFiltradas = useMemo(() => {
    const secoes: Secao[] = CATEGORIAS_MOCK.map((categoria) => ({
      title: categoria.nome,
      categoriaId: categoria.id,
      cor: categoria.cor,
      icone: categoria.icone,
      data: produtosFiltrados.filter((p) => p.categoriaId === categoria.id),
    })).filter((secao) => secao.data.length > 0);

    return secoes;
  }, [produtosFiltrados]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderItem = ({ item }: { item: Produto }) => {
    const categoria = getCategoriaPorId(item.categoriaId);
    const emAlerta = item.quantidade < item.quantidadeMinima;
    const semEstoque = item.quantidade === 0;

    let statusColor = Colors.success.border;
    let statusBg = Colors.success.bg;
    let statusText = "Normal";

    if (semEstoque) {
      statusColor = Colors.danger.text;
      statusBg = Colors.danger.bg;
      statusText = "Sem estoque";
    } else if (emAlerta) {
      statusColor = Colors.warning.text;
      statusBg = Colors.warning.bg;
      statusText = "Baixo";
    }

    return (
      <TouchableOpacity style={styles.productItem}>
        <View
          style={[
            styles.productIcon,
            { backgroundColor: categoria?.cor || Colors.neutral[200] },
          ]}
        >
          <Ionicons
            name={(categoria?.icone as any) || "cube-outline"}
            size={18}
            color={Colors.white}
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.productMeta}>
            {item.quantidade} {item.unidade} • {categoria?.nome || "Sem categoria"}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: Secao }) => (
    <View
      style={[
        styles.sectionHeader,
        {
          backgroundColor: Colors.surface,
          borderLeftColor: section.cor,
        },
      ]}
    >
      <View style={[styles.sectionIcon, { backgroundColor: section.cor }]}>
        <Ionicons name={section.icone as any} size={14} color={Colors.white} />
      </View>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} itens</Text>
    </View>
  );

  const ListaVazia = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={Colors.neutral[400]} />
      <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {busca
          ? `Tente buscar por "${busca}" em outra categoria`
          : "Tente ajustar os filtros de busca"}
      </Text>
    </View>
  );

  const Separator = () => <View style={styles.separator} />;

  const totalItens = produtosFiltrados.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Cabeçalho com título e botões */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Produtos</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("./produtos")}
            >
              <Ionicons name="add" size={28}  color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setModoAgrupado((prev) => !prev)}
            >
              <Ionicons
                name={modoAgrupado ? "list-outline" : "grid-outline"}
                size={24}
                color={Colors.primary[600]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            placeholderTextColor={Colors.neutral[400]}
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Ionicons name="close-circle" size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>

        {!modoAgrupado && (
          <View style={styles.chipsRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContent}
            >
              <TouchableOpacity
                style={[styles.chip, categoriaAtiva === null && styles.chipActive]}
                onPress={() => setCategoriaAtiva(null)}
              >
                <Text
                  style={[
                    styles.chipText,
                    categoriaAtiva === null && styles.chipTextActive,
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              {CATEGORIAS_MOCK.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    categoriaAtiva === cat.id && styles.chipActive,
                    { borderColor: cat.cor },
                  ]}
                  onPress={() =>
                    setCategoriaAtiva(categoriaAtiva === cat.id ? null : cat.id)
                  }
                >
                  <Ionicons
                    name={cat.icone as any}
                    size={12}
                    color={categoriaAtiva === cat.id ? Colors.white : cat.cor}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      categoriaAtiva === cat.id && styles.chipTextActive,
                    ]}
                  >
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.filterRow}>
          <Text style={styles.resultCount}>
            {totalItens} {totalItens === 1 ? "item" : "itens"}
          </Text>
        </View>

        {!modoAgrupado ? (
          <FlatList<Produto>
            data={produtosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={ListaVazia}
          />
        ) : (
          <SectionList<Produto, Secao>
            sections={secoesFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={ListaVazia}
            stickySectionHeadersEnabled={true}
            SectionSeparatorComponent={() => (
              <View style={styles.sectionSeparator} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  addButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: Colors.primary[600],
  alignItems: "center",
  justifyContent: "center",
  shadowColor: Colors.primary[600],
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 3,
},
  headerButton: {
    padding: Spacing[1],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[3],
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  chipsScrollContent: {
    flexDirection: "row",
    gap: Spacing[2],
    paddingRight: Spacing[2],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing[1],
  },
  chipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: Spacing[3],
  },
  resultCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  listContent: { paddingBottom: Spacing[8] },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    gap: Spacing[3],
  },
  productIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  productMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  separator: { height: Spacing[2] },
  sectionSeparator: { height: Spacing[3] },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.md,
    gap: Spacing[2],
    borderLeftWidth: 4,
    zIndex: 1,
    elevation: 4,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    }),
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[10],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginTop: Spacing[3],
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
    textAlign: "center",
  },
});
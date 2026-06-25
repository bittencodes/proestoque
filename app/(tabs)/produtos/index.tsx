import Input from "@/src/components/Input";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useProducts } from "@/src/contexts/ProductsContext";
import { CATEGORIAS_MOCK, getCategoriaPorId } from "@/src/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList, Image, ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListaProdutos() {
  const { produtos } = useProducts();
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [modoAgrupado, setModoAgrupado] = useState(false);
  const navigation = useNavigation();

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const categoriaOk = categoriaAtiva ? p.categoriaId === categoriaAtiva : true;
      return buscaOk && categoriaOk;
    });
  }, [produtos, busca, categoriaAtiva]);

  const secoes = useMemo(() => {
    return CATEGORIAS_MOCK.map((cat) => ({
      title: cat.nome,
      data: produtosFiltrados.filter((p) => p.categoriaId === cat.id),
    })).filter((sec) => sec.data.length > 0);
  }, [produtosFiltrados]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModoAgrupado((prev) => !prev)}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name={modoAgrupado ? "list-outline" : "grid-outline"}
            size={24}
            color={Colors.primary[600]}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, modoAgrupado]);

  const renderItem = ({ item }: { item: any }) => {
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
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => router.push(`/produtos/${item.id}`)}
      >
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.productImage} />
        ) : (
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
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemQtd}>
            {item.quantidade} {item.unidade} •{" "}
            {categoria?.nome || "Sem categoria"}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusBg }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Input
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar produto..."
        leftIcon="search-outline"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
        <TouchableOpacity
          style={[styles.chip, categoriaAtiva === null && styles.chipAtivo]}
          onPress={() => setCategoriaAtiva(null)}
        >
          <Text style={[styles.chipText, categoriaAtiva === null && styles.chipTextoAtivo]}>
            Todos
          </Text>
        </TouchableOpacity>
        {CATEGORIAS_MOCK.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, categoriaAtiva === cat.id && styles.chipAtivo]}
            onPress={() => setCategoriaAtiva(categoriaAtiva === cat.id ? null : cat.id)}
          >
            <Text style={[styles.chipText, categoriaAtiva === cat.id && styles.chipTextoAtivo]}>
              {cat.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.vazio}>
      <Ionicons name="cube-outline" size={48} color={Colors.neutral[400]} />
      <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
      <TouchableOpacity onPress={() => router.push("/produtos/novo")}>
        <Text style={styles.vazioLink}>Cadastrar produto</Text>
      </TouchableOpacity>
    </View>
  );

  const commonProps = {
    ListHeaderComponent: ListHeader,
    ListEmptyComponent: ListEmpty,
    contentContainerStyle: styles.listContent,
    ItemSeparatorComponent: () => <View style={styles.separator} />,
    showsVerticalScrollIndicator: false,
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {!modoAgrupado ? (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          {...commonProps}
        />
      ) : (
        <SectionList
          sections={secoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          {...commonProps}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/produtos/novo")}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[10] },
  header: { paddingTop: Spacing[4], gap: Spacing[3], marginBottom: Spacing[2] },
  chipsContainer: { flexDirection: "row", gap: Spacing[2], paddingVertical: 4 },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    backgroundColor: Colors.neutral[100],
  },
  chipAtivo: { backgroundColor: Colors.primary[600] },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextoAtivo: { color: Colors.white },
  itemInfo: { flex: 1 },
  itemNome: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  itemQtd: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: { paddingHorizontal: Spacing[2], paddingVertical: Spacing[1], borderRadius: Radius.full },
  badgeText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.medium },
  separator: { height: Spacing[2] },
  vazio: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: Spacing[3] },
  vazioText: { color: Colors.textSecondary, fontSize: Typography.fontSize.md },
  vazioLink: { color: Colors.primary[600], fontWeight: Typography.fontWeight.semibold },
  sectionHeader: {
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    marginVertical: Spacing[1],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  productImage: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    
  },
  productIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    gap: Spacing[3],
  },
});
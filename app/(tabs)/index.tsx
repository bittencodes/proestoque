import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing, Typography } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  CATEGORIAS_MOCK,
  formatarPreco,
  getCategoriaPorId,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  PRODUTOS_MOCK,
  type Produto,
} from "../../src/data/mockData";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const alertas = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotal = useMemo(() => getValorTotalEstoque(), []);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const cardsResumo = [
    {
      id: "total",
      titulo: "Produtos",
      valor: PRODUTOS_MOCK.length,
      icone: "cube-outline" as const,
      cor: Colors.primary[600],
      bg: Colors.primary[50],
    },
    {
      id: "alertas",
      titulo: "Alertas",
      valor: alertas.length,
      icone: "alert-circle-outline" as const,
      cor: alertas.length > 0 ? Colors.warning.text : Colors.success.border,
      bg: Colors.warning.bg,
    },
    {
      id: "categorias",
      titulo: "Categorias",
      valor: CATEGORIAS_MOCK.length,
      icone: "grid-outline" as const,
      cor: Colors.info.text,
      bg: Colors.info.bg,
    },
    {
      id: "valor",
      titulo: "Em Estoque",
      valor: formatarPreco(valorTotal),
      icone: "cash-outline" as const,
      cor: Colors.success.border,
      bg: Colors.success.bg,
    },
  ];

  const DashboardHeader = () => {
    const dataHoje = new Date().toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <View style={styles.headerContainer}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nome?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>
                {saudacao}, {user?.nome?.split(" ")[0] ?? "Usuário"} 👋
              </Text>
              <Text style={styles.dateText}>{dataHoje}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/produtos")}
          >
            <Ionicons name="add" size={32} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsGrid}>
          {cardsResumo.map((card) => (
            <View key={card.id} style={[styles.card, { backgroundColor: card.bg }]}>
              <View style={styles.cardIconContainer}>
                <Ionicons name={card.icone} size={20} color={card.cor} />
              </View>
              <Text style={styles.cardValue}>{card.valor}</Text>
              <Text style={styles.cardTitle}>{card.titulo}</Text>
            </View>
          ))}
        </View>

        {alertas.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning-outline" size={20} color={Colors.danger.text} />
              <Text style={styles.alertTitle}>
                Estoque crítico ({alertas.length} produtos)
              </Text>
            </View>
            {alertas.slice(0, 3).map((produto) => (
              <View key={produto.id} style={styles.alertItem}>
                <Text style={styles.alertItemName}>{produto.nome}</Text>
                <Text style={styles.alertItemQty}>
                  {produto.quantidade} / {produto.quantidadeMinima} {produto.unidade}
                </Text>
              </View>
            ))}
            {alertas.length > 3 && (
              <TouchableOpacity style={styles.alertSeeAllWrapper}>
                <Text style={styles.alertSeeAll}>
                  Ver todos os {alertas.length} alertas →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Produtos Recentes</Text>
          <Text style={styles.sectionCount}>{PRODUTOS_MOCK.length} itens</Text>
        </View>
      </View>
    );
  };

  const renderProduto = ({ item }: { item: Produto }) => {
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

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Produto>
        data={PRODUTOS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  headerContainer: {
    paddingTop: Spacing[2],
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[4],
  },
  greetingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  card: {
    width: "48%",
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconContainer: {
    marginBottom: Spacing[1],
  },
  cardValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  alertBanner: {
    backgroundColor: Colors.danger.bg,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.danger.border,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  alertTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.danger.text,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  alertItemName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  alertItemQty: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  alertSeeAllWrapper: {
    alignItems: "flex-end",
    marginTop: Spacing[1],
  },
  alertSeeAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.medium,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
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
  productInfo: {
    flex: 1,
  },
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
  separator: {
    height: Spacing[2],
  },
});
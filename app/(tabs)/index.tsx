import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius } from "../../src/constants/theme";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, João 👋</Text>
      <Text style={styles.subtitle}>Visão geral do seu estoque</Text>

      {/* CARD PRINCIPAL */}
      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>Total de produtos</Text>
        <Text style={styles.cardValue}>247</Text>
      </View>

      {/* CARDS MENORES */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text>Categorias</Text>
          <Text style={styles.smallValue}>12</Text>
        </View>

        <View style={styles.smallCard}>
          <Text>Alertas</Text>
          <Text style={[styles.smallValue, { color: "red" }]}>5</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        —  vai ser preenchido na próxima aula —
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  mainCard: {
    backgroundColor: Colors.primary[600],
    padding: 20,
    borderRadius: Radius.lg,
    marginBottom: 20,
  },
  cardLabel: {
    color: "#ddd",
  },
  cardValue: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: Radius.lg,
  },
  smallValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: Colors.textSecondary,
  },
});
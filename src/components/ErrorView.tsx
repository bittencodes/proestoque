import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorViewProps {
  mensagem: string;
  onRetry?: () => void;
}

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={Colors.neutral[400]} />
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.botao} onPress={onRetry}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[3],
    padding: Spacing[6],
  },
  titulo: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  mensagem: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  botao: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
  },
  botaoTexto: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
});
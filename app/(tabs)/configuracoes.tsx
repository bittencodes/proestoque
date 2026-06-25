import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../src/components/Button";
import { Colors, Radius, Spacing, Typography } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

type MenuItem = {
  id: string;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            await logout();
            setIsLoading(false);
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { id: "notificacoes", titulo: "Notificações", icone: "notifications-outline" },
    { id: "aparencia", titulo: "Aparência", icone: "color-palette-outline" },
    { id: "ajuda", titulo: "Ajuda", icone: "help-circle-outline" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Configurações</Text>

        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {user?.nome?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
          <View style={styles.perfilInfo}>
            <Text style={styles.nome}>{user?.nome ?? "Usuário"}</Text>
            <Text style={styles.email}>{user?.email ?? "email@exemplo.com"}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icone} size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>{item.titulo}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <Button
            label="Sair da conta"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            loading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing[6] },
  titulo: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[6],
  },
  perfilCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[6],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetra: {
    color: Colors.white,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  perfilInfo: {
    flex: 1,
  },
  nome: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing[6],
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  menuItemText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Spacing[4],
  },
});
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../src/constants/theme";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ProductsProvider } from "../src/contexts/ProductsContext";

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const estaNoGrupoAuth = segments[0] === "(auth)";
    if (!isAuthenticated && !estaNoGrupoAuth) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && estaNoGrupoAuth) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ProductsProvider>
        {!minTimePassed ? (
          <View style={styles.splashContainer}>
            <View style={styles.splashIconBox}>
              <Ionicons name="bag-handle-outline" size={48} color={Colors.white} />
            </View>
            <Text style={styles.splashTitle}>ProEstoque</Text>
            <Text style={styles.splashSubtitle}>Carregando...</Text>
            <ActivityIndicator
              size="large"
              color={Colors.primary[600]}
              style={{ marginTop: Spacing[6] }}
            />
          </View>
        ) : (
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <NavigationGuard />
          </>
        )}
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  splashIconBox: {
    backgroundColor: Colors.primary[600],
    padding: 20,
    borderRadius: 24,
    marginBottom: Spacing[4],
  },
  splashTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
  },
  splashSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing[2],
  },
});
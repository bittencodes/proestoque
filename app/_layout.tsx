import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../src/constants/theme";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <NavigationGuard />
    </AuthProvider>
  );
}
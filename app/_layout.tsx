import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

import SplashScreen from "../src/components/SplashScreen";
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

  return null;
}

export default function RootLayout() {
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {!minTimePassed ? (
        <SplashScreen />
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <NavigationGuard />
        </>
      )}
    </AuthProvider>
  );
}
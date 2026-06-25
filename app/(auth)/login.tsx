import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoProEstoque from "../../src/components/LogoProEstoque";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors, Spacing, Typography } from "../../src/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const senhaRef = useRef<any>(null);

  const handleLogin = async () => {
    setLoading(true);
    // Simula chamada à API
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo / Nome do App */}
            <LogoProEstoque size="md" />

            <View style={styles.form}>
              <Input
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
                placeholder="seu@email.com"
              />

              <Input
                ref={senhaRef}
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                leftIcon="lock-closed-outline"
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                placeholder="••••••••"
              />

              <TouchableOpacity
                onPress={() => router.push("/(auth)/recuperar-senha")}
                style={styles.forgotLink}
              >
                <Text style={styles.linkText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              <Button
                label="Entrar"
                onPress={handleLogin}
                loading={loading}
                fullWidth
                style={{ marginTop: Spacing[2] }}
              />

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
                  <Text style={[styles.linkText, { fontWeight: "bold" }]}>Criar conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

import { StatusBar } from "react-native";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  logoContainer: { alignItems: "center", marginBottom: 48, marginTop: 20 },
  logoText: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
    marginTop: Spacing[2],
  },
  form: { flex: 1 },
  forgotLink: { alignSelf: "flex-end", marginBottom: Spacing[4] },
  linkText: {
    color: Colors.primary[600],
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[6],
  },
  registerText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
});
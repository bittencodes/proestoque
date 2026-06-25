import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import LogoProEstoque from "../../src/components/LogoProEstoque";
import { Colors, Spacing, Typography } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      await login(email, senha);
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha inválidos.");
    }
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
            <LogoProEstoque size="md" showText={true} />

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
                placeholder="seu@email.com"
              />

              <Input
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                isPassword
                leftIcon="lock-closed-outline"
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
                loading={isLoading}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
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
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors, Spacing } from "../../src/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="bag-handle-outline" size={28} color="white" />
          </View>
        </View>
          <Text style={styles.title}>ProEstoque</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            isPassword
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/recuperar-senha")}
          >
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Button label="Entrar" onPress={handleLogin} fullWidth />

          <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
            <Text style={styles.linkCenter}>
              Não tem conta? <Text style={styles.bold}>Cadastrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },
  content: {
    gap: Spacing[4],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary[600],
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  link: {
    color: Colors.primary[600],
    textAlign: "right",
  },
  linkCenter: {
    textAlign: "center",
    marginTop: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    backgroundColor: Colors.primary[600],
    padding: 16,
    borderRadius: 20,
  },
});
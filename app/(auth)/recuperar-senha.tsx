import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
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
import LogoProEstoque from "../../src/components/LogoProEstoque";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors, Spacing, Typography } from "../../src/constants/theme";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnviar = () => {
    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
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
            {/* Botão Voltar */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>

            <LogoProEstoque size="md" showText={false} />
            <Text style={styles.title}>Recuperar Senha</Text>

            {!enviado ? (
              <>
                <Text style={styles.description}>
                  Informe seu e-mail e enviaremos um link para redefinir sua senha.
                </Text>
                <View style={styles.form}>
                  <Input
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="seu@email.com"
                    returnKeyType="send"
                    onSubmitEditing={handleEnviar}
                  />
                  <Button
                    label="Enviar link"
                    onPress={handleEnviar}
                    loading={loading}
                    fullWidth
                  />
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={64} color={Colors.success.border} />
                <Text style={styles.successTitle}>E-mail enviado!</Text>
                <Text style={styles.successDesc}>
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </Text>
                <Button
                  label="Voltar ao Login"
                  onPress={() => router.back()}
                  fullWidth
                  variant="outline"
                  style={{ marginTop: Spacing[6] }}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

import { Alert } from "react-native";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  backButton: { marginBottom: Spacing[6] },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing[6],
    lineHeight: 22,
    textAlign: 'center',
  },
  form: { flex: 1 },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  successTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing[4],
  },
  successDesc: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing[2],
    marginBottom: Spacing[6],
    paddingHorizontal: 20,
  },
});
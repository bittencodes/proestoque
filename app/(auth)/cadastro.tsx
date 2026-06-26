import { router } from "expo-router";
import { useRef, useState } from "react";
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
import LogoProEstoque from "../../src/components/LogoProEstoque";

//Authcontext
import { useAuth } from "@/src/contexts/AuthContext";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors, Spacing, Typography } from "../../src/constants/theme";

type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function Cadastro() {
  const [form, setForm] = useState<FormFields>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  // Refs para navegação entre campos
  const emailRef = useRef<any>(null);
  const senhaRef = useRef<any>(null);
  const confirmarRef = useRef<any>(null);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Validação em tempo real para confirmar senha
    if (field === "confirmarSenha" || field === "senha") {
      if (field === "senha" && form.confirmarSenha) {
        // Se mudou a senha, revalida a confirmação
        if (value !== form.confirmarSenha) {
          setErrors((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem" }));
        } else {
          setErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
        }
      }
      if (field === "confirmarSenha") {
        if (value !== form.senha) {
          setErrors((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem" }));
        } else {
          setErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
        }
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormFields> = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.email.includes("@") || !form.email.includes("."))
      newErrors.email = "Informe um e-mail válido";
    if (form.senha.length < 6) newErrors.senha = "Mínimo 6 caracteres";
    if (form.senha !== form.confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { registrar } = useAuth();

const handleCadastro = async () => {
  if (!validate()) return;
  try {
    await registrar(form.nome, form.email, form.senha);
    // O NavigationGuard redireciona automaticamente para o dashboard
  } catch (error: any) {
    Alert.alert("Erro", error.message);
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

            <LogoProEstoque size="md" showText={false} />
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para começar</Text>

            <View style={styles.form}>
              <Input
                label="Nome completo"
                value={form.nome}
                onChangeText={(v) => updateField("nome", v)}
                error={errors.nome}
                leftIcon="person-outline"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <Input
                ref={emailRef}
                label="E-mail"
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
                error={errors.email}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
              <Input
                ref={senhaRef}
                label="Senha"
                value={form.senha}
                onChangeText={(v) => updateField("senha", v)}
                leftIcon="lock-closed-outline"
                error={errors.senha}
                isPassword
                returnKeyType="next"
                onSubmitEditing={() => confirmarRef.current?.focus()}
              />
              <Input
                ref={confirmarRef}
                label="Confirmar senha"
                value={form.confirmarSenha}
                onChangeText={(v) => updateField("confirmarSenha", v)}
                leftIcon="lock-closed-outline"
                error={errors.confirmarSenha}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleCadastro}
              />

              <Button
                label="Criar Conta"
                onPress={handleCadastro}
                loading={loading}
                fullWidth
                style={{ marginTop: Spacing[4] }}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={[styles.linkText, { fontWeight: "bold" }]}>Faça login</Text>
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
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing[6],
    textAlign: 'center',
  },
  form: { flex: 1 },
  linkText: {
    color: Colors.primary[600],
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[6],
  },
  loginText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
});
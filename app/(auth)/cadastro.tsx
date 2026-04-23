import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors } from "../../src/constants/theme";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.nome) newErrors.nome = "Informe o nome";
    if (!form.email.includes("@")) newErrors.email = "Email inválido";
    if (form.senha.length < 6)
      newErrors.senha = "Mínimo 6 caracteres";
    if (form.senha !== form.confirmarSenha)
      newErrors.confirmarSenha = "Senhas não coincidem";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = () => {
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sucesso", "Conta criada!");
      router.back();
    }, 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
        justifyContent: "center",
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Criar conta</Text>

      <Input
        label="Nome Completo"
        value={form.nome}
        onChangeText={(v) => update("nome", v)}
        error={errors.nome}
        leftIcon="person-outline"
      />

      <Input
        label="E-mail"
        value={form.email}
        onChangeText={(v) => update("email", v)}
        error={errors.email}
        leftIcon="mail-outline"
      />

      <Input
        label="Senha"
        value={form.senha}
        onChangeText={(v) => update("senha", v)}
        error={errors.senha}
        isPassword
        leftIcon="lock-closed-outline"
      />

      <Input
        label="Confirmar senha"
        value={form.confirmarSenha}
        onChangeText={(v) => update("confirmarSenha", v)}
        error={errors.confirmarSenha}
        isPassword
      />

      <Button
        label="Criar Conta"
        onPress={handleCadastro}
        loading={loading}
        fullWidth
      />

      <Text style={styles.link} onPress={() => router.back()}>
        Já tenho conta
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: Colors.primary[600],
  },
});
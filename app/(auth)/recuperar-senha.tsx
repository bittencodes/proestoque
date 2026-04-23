import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { Colors } from "../../src/constants/theme";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <View style={styles.container}>
      {!enviado ? (
        <>
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe seu e-mail e enviaremos um link
          </Text>

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
          />

          <Button
            label="Enviar"
            onPress={() => setEnviado(true)}
            fullWidth
          />
        </>
      ) : (
        <>
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>E-mail enviado!</Text>
            <Text>Verifique sua caixa de entrada</Text>
          </View>

          <Button
            label="Voltar ao login"
            onPress={() => router.back()}
            variant="outline"   // 👈 OBRIGATÓRIO
            fullWidth
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 20,
    color: Colors.textSecondary,
  },
  success: {
    fontSize: 20,
    color: Colors.success.text,
    textAlign: "center",
    marginBottom: 10,
  },
  back: {
    color: Colors.primary[600],
    marginBottom: 10,
  },

  successBox: {
    backgroundColor: "#d1fae5",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  successTitle: {
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },
});
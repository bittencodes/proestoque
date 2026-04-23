import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Colors, Radius, Spacing } from "../constants/theme";

interface Props extends TextInputProps { // 👈 AQUI É A CHAVE
  label?: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

export default function Input({
  label,
  error,
  isPassword,
  leftIcon,
  ...rest // 👈 pega TODAS props do TextInput
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: Spacing[4] }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.container, error && styles.error]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={Colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={{ flex: 1 }}
          secureTextEntry={isPassword && !showPassword}
          {...rest} // 👈 AQUI A MÁGICA ACONTECE
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={Colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 10,
    backgroundColor: "#fff",
  },
  error: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
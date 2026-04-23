import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { Colors } from "../constants/theme";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "outline"; // 👈 AGORA EXISTE
}

export default function Button({
  label,
  onPress,
  loading,
  fullWidth,
  variant = "primary",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.outline,
        fullWidth && { width: "100%" },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#000"} />
      ) : (
        <Text
          style={
            variant === "primary" ? styles.textWhite : styles.textDark
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primary: {
    backgroundColor: Colors.primary[600],
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  textWhite: {
    color: "#fff",
    fontWeight: "bold",
  },
  textDark: {
    color: Colors.primary[600],
    fontWeight: "bold",
  },
});
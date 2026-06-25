import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  showText?: boolean; 
}

export default function LogoProEstoque({ 
  size = "md", 
  showText = true // <-- Padrão: exibe o texto (para a tela de login)
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 16, padding: 10, radius: 14 },
    md: { icon: 36, text: 24, padding: 14, radius: 18 },
    lg: { icon: 48, text: 32, padding: 18, radius: 24 },
  };

  const current = sizeMap[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { padding: current.padding, borderRadius: current.radius }]}>
        <Ionicons name="bag-handle-outline" size={current.icon} color={Colors.white} />
      </View>
      {showText && (
        <Text style={[styles.text, { fontSize: current.text }]}>
          ProEstoque
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: Spacing[4] },
  iconBox: { backgroundColor: Colors.primary[600], marginBottom: Spacing[2] },
  text: { fontWeight: Typography.fontWeight.bold, color: Colors.primary[600] },
});
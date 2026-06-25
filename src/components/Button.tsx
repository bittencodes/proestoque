import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle; 
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style, 
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style, 
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? Colors.white : Colors.primary[600]}
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.label,
              styles[`label_${variant}`],
              styles[`labelSize_${size}`],
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  primary: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] },
  outline: { backgroundColor: "transparent", borderColor: Colors.primary[600] },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" },
  danger: { backgroundColor: Colors.danger.bg, borderColor: Colors.danger.border },
  size_sm: { paddingVertical: Spacing[2], paddingHorizontal: Spacing[3] },
  size_md: { paddingVertical: Spacing[3], paddingHorizontal: Spacing[5] },
  size_lg: { paddingVertical: Spacing[4], paddingHorizontal: Spacing[6] },
  fullWidth: { width: "100%" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
  label: { fontWeight: Typography.fontWeight.semibold },
  label_primary: { color: Colors.white },
  label_outline: { color: Colors.primary[600] },
  label_ghost: { color: Colors.primary[600] },
  label_danger: { color: Colors.danger.text },
  labelSize_sm: { fontSize: Typography.fontSize.sm },
  labelSize_md: { fontSize: Typography.fontSize.md },
  labelSize_lg: { fontSize: Typography.fontSize.lg },
});
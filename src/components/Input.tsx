import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";


interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      isPassword = false,
      style, 
      ...rest 
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasError = !!error;

    return (
     
      <View style={[styles.wrapper, style]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            focused && styles.focused,
            hasError && styles.errorBorder,
          ]}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={18}
              color={focused ? Colors.primary[600] : Colors.neutral[400]}
              style={styles.leftIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={styles.input} // <-- O estilo do input permanece fixo aqui
            placeholderTextColor={Colors.neutral[400]}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={styles.rightIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={Colors.neutral[400]}
              />
            </Pressable>
          )}
        </View>

        {hasError && <Text style={styles.errorText}>{error}</Text>}
        {!hasError && hint && <Text style={styles.hintText}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";

export default Input;


const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing[4] },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing[1],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
  },
  focused: { borderColor: Colors.primary[600] },
  errorBorder: { borderColor: Colors.danger.border },
  input: {
    flex: 1,
    paddingVertical: Spacing[3],
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
  },
  leftIcon: { marginRight: Spacing[2] },
  rightIcon: { padding: Spacing[1] },
  errorText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
  },
  hintText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});
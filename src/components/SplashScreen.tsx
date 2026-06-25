import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SplashScreen() {
  
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false, 
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="bag-handle-outline" size={56} color={Colors.white} />
      </View>

      <Text style={styles.title}>ProEstoque</Text>
      <Text style={styles.subtitle}>Verificando sessão...</Text>

      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[6],
  },
  iconBox: {
    backgroundColor: Colors.primary[600],
    padding: 24,
    borderRadius: Radius.xl,
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing[8],
  },
  progressBarContainer: {
    width: "80%",
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary[600],
    borderRadius: Radius.full,
  },
});
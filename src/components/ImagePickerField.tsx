import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";

interface ImagePickerFieldProps {
  value: string | null;
  onChange: (uri: string | null) => void;
  label?: string;
}

export default function ImagePickerField({
  value,
  onChange,
  label = "Foto do produto",
}: ImagePickerFieldProps) {
  const [loading, setLoading] = useState(false);

  const solicitarPermissaoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria nas configurações do dispositivo."
      );
      return false;
    }
    return true;
  };

  const solicitarPermissaoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à câmera nas configurações do dispositivo."
      );
      return false;
    }
    return true;
  };

  const abrirGaleria = async () => {
    if (!(await solicitarPermissaoGaleria())) return;
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    setLoading(false);
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const abrirCamera = async () => {
    if (!(await solicitarPermissaoCamera())) return;
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    setLoading(false);
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const mostrarOpcoes = () => {
    Alert.alert(
      label,
      "Escolha uma opção",
      [
        { text: "Câmera", onPress: abrirCamera },
        { text: "Galeria", onPress: abrirGaleria },
        value
          ? {
              text: "Remover foto",
              style: "destructive",
              onPress: () => onChange(null),
            }
          : null,
        { text: "Cancelar", style: "cancel" },
      ].filter(Boolean) as any
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, loading && styles.loading]}
      onPress={mostrarOpcoes}
      disabled={loading}
    >
      {value ? (
        <Image source={{ uri: value }} style={styles.imagem} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={32} color={Colors.neutral[400]} />
          <Text style={styles.placeholderText}>Adicionar foto</Text>
        </View>
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: Colors.surface,
    marginVertical: Spacing[2],
  },
  loading: { opacity: 0.6 },
  imagem: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: Colors.neutral[50],
  },
  placeholderText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[400],
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});
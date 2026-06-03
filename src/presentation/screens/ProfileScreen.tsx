import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";

export function ProfileScreen() {
  const { session, signOut, updateProfileImage } = useAuth();

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria para escolher uma foto de perfil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const imageUri = result.assets[0].uri;

    await updateProfileImage(imageUri);
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage}>
          {session?.usuario.fotoUrl ? (
            <Image
              source={{ uri: session.usuario.fotoUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person-outline" size={48} color={colors.textLight} />
            </View>
          )}

          <View style={styles.cameraBadge}>
            <Ionicons name="camera-outline" size={18} color={colors.textLight} />
          </View>
        </TouchableOpacity>

        <Text style={styles.changePhotoText}>Tocar para alterar foto</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowIcon}>
          <Ionicons name="person-outline" size={20} color={colors.carbon} />
          <View>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{session?.usuario.nome}</Text>
          </View>
        </View>

        <View style={styles.rowIcon}>
          <Ionicons name="mail-outline" size={20} color={colors.carbon} />
          <View>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{session?.usuario.email}</Text>
          </View>
        </View>

        <View style={styles.rowIcon}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.carbon} />
          <View>
            <Text style={styles.label}>Perfil de acesso</Text>

            <View style={styles.badgeBox}>
              <StatusBadge
                label={session?.usuario.perfil ?? "SEM PERFIL"}
                variant="carbon"
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonBox}>
        <PrimaryButton title="Sair" variant="danger" onPress={signOut} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "bold",
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatarButton: {
    position: "relative",
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  avatarFallback: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.carbon,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  changePhotoText: {
    color: colors.secondary,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  rowIcon: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  badgeBox: {
    marginTop: spacing.sm,
  },
  buttonBox: {
    marginTop: spacing.xl,
  },
});
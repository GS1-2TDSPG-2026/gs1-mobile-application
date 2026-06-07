import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";

export function ProfileScreen() {
  const { session, signOut, updateProfileImage } = useAuth();
  const { profile, loading, submitting, error, reload, updateProfile } =
    useUserProfile();

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (profile) {
      setNome(profile.nome);
      setEmail(profile.email);
      setTelefone(profile.telefone ?? "");
    }
  }, [profile]);

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

  async function handleSaveProfile() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Campos obrigatórios", "Informe nome e e-mail.");
      return;
    }

    try {
      await updateProfile({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
        status: profile?.status ?? "ATIVO",
      });

      setEditing(false);

      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  }

  function handleCancelEdit() {
    if (profile) {
      setNome(profile.nome);
      setEmail(profile.email);
      setTelefone(profile.telefone ?? "");
    }

    setEditing(false);
  }

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error && !profile) {
    return (
      <ScreenContainer>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={reload}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Perfil</Text>

      {error ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage}>
          {session?.usuario.fotoUrl ? (
            <Image
              source={{ uri: session.usuario.fotoUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons
                name="person-outline"
                size={48}
                color={colors.textLight}
              />
            </View>
          )}

          <View style={styles.cameraBadge}>
            <Ionicons name="camera-outline" size={18} color={colors.textLight} />
          </View>
        </TouchableOpacity>

        <Text style={styles.changePhotoText}>Tocar para alterar foto</Text>
      </View>

      <View style={styles.card}>
        {!editing ? (
          <>
            <View style={styles.rowIcon}>
              <Ionicons name="person-outline" size={20} color={colors.carbon} />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.value}>
                  {profile?.nome ?? session?.usuario.nome}
                </Text>
              </View>
            </View>

            <View style={styles.rowIcon}>
              <Ionicons name="mail-outline" size={20} color={colors.carbon} />
              <View style={styles.rowContent}>
                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.value}>
                  {profile?.email ?? session?.usuario.email}
                </Text>
              </View>
            </View>

            <View style={styles.rowIcon}>
              <Ionicons name="call-outline" size={20} color={colors.carbon} />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Telefone</Text>
                <Text style={styles.value}>
                  {profile?.telefone || "Não informado"}
                </Text>
              </View>
            </View>

            <View style={styles.rowIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.carbon}
              />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Perfil de acesso</Text>

                <View style={styles.badgeBox}>
                  <StatusBadge
                    label={profile?.perfil ?? session?.usuario.perfil ?? "SEM PERFIL"}
                    variant="carbon"
                  />
                </View>
              </View>
            </View>

            <View style={styles.rowIcon}>
              <Ionicons
                name="pulse-outline"
                size={20}
                color={colors.carbon}
              />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{profile?.status ?? "ATIVO"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setEditing(true)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.textLight}
              />
              <Text style={styles.editProfileButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.formLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.formLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.formLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            <TouchableOpacity
              style={[styles.saveButton, submitting && styles.disabledButton]}
              onPress={handleSaveProfile}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.textLight} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
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
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.secondary,
    fontSize: typography.body,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.textLight,
    fontSize: typography.body,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
  },
  retryButtonText: {
    color: colors.textLight,
    fontWeight: "bold",
  },
  inlineError: {
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    borderColor: "rgba(220, 38, 38, 0.28)",
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  inlineErrorText: {
    color: colors.textLight,
    fontSize: typography.small,
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
  rowContent: {
    flex: 1,
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
  editProfileButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  editProfileButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
    marginLeft: 8,
  },
  formLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
  },
  cancelButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonBox: {
    marginTop: spacing.xl,
  },
});
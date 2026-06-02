import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";

export function ProfileScreen() {
  const { session, signOut } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{session?.usuario.nome}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{session?.usuario.email}</Text>

        <Text style={styles.label}>Perfil de acesso</Text>

        <View style={styles.badgeBox}>
          <StatusBadge label={session?.usuario.perfil ?? "SEM PERFIL"} variant="carbon" />
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.md,
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
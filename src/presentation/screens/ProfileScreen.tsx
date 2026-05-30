import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { useAuth } from "../contexts/AuthContext";

export function ProfileScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{session?.usuario.nome}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{session?.usuario.email}</Text>

        <Text style={styles.label}>Perfil de acesso</Text>
        <Text style={styles.badge}>{session?.usuario.perfil}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
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
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.carbon,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },
});
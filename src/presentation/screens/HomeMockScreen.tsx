import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { useAuth } from "../contexts/AuthContext";

export function HomeMockScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Phycocarbon</Text>

      <Text style={styles.label}>Usuário:</Text>
      <Text style={styles.value}>{session?.usuario.nome}</Text>

      <Text style={styles.label}>E-mail:</Text>
      <Text style={styles.value}>{session?.usuario.email}</Text>

      <Text style={styles.label}>Perfil:</Text>
      <Text style={styles.badge}>{session?.usuario.perfil}</Text>

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
    justifyContent: "center",
  },
  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "bold",
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.secondary,
    fontSize: typography.caption,
    marginTop: spacing.md,
  },
  value: {
    color: colors.textLight,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  badge: {
    alignSelf: "flex-start",
    color: colors.textLight,
    backgroundColor: colors.carbon,
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
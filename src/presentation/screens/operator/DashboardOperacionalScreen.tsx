import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { useAuth } from "../../contexts/AuthContext";

export function DashboardOperacionalScreen() {
  const { session } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Operacional</Text>

      <Text style={styles.subtitle}>
        Olá, {session?.usuario.nome}. Aqui será exibido o monitoramento dos
        tanques de microalgas.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>pH atual</Text>
        <Text style={styles.cardValue}>7.2</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Temperatura</Text>
        <Text style={styles.cardValue}>26.5°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Status ESP32</Text>
        <Text style={styles.cardValue}>Online</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Previsão IA</Text>
        <Text style={styles.cardValue}>Pico de biomassa em 48h</Text>
      </View>
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  cardValue: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
});
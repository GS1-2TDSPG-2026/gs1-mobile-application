import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../core/theme";

export function CarteiraCarbonoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira de Carbono</Text>

      <View style={styles.card}>
        <Text style={styles.label}>CO₂ sequestrado</Text>
        <Text style={styles.value}>38.4 tCO₂e</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Créditos disponíveis</Text>
        <Text style={styles.value}>24</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Valor estimado</Text>
        <Text style={styles.value}>R$ 42.800</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Última validação</Text>
        <Text style={styles.value}>Hash auditável gerado</Text>
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
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
});
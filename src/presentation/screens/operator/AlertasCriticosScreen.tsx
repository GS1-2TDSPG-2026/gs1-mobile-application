import { FlatList, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../core/theme";

const mockAlerts = [
  {
    id: "1",
    tanque: "Tanque A01",
    tipo: "pH crítico",
    mensagem: "pH abaixo do limite seguro para Spirulina.",
    severidade: "CRÍTICO",
  },
  {
    id: "2",
    tanque: "Tanque B02",
    tipo: "Temperatura elevada",
    mensagem: "Temperatura acima do ideal para crescimento celular.",
    severidade: "ATENÇÃO",
  },
];

export function AlertasCriticosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas Críticos</Text>

      <FlatList
        data={mockAlerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.severity}>{item.severidade}</Text>
            <Text style={styles.cardTitle}>{item.tanque}</Text>
            <Text style={styles.cardType}>{item.tipo}</Text>
            <Text style={styles.message}>{item.mensagem}</Text>
          </View>
        )}
      />
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
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  severity: {
    alignSelf: "flex-start",
    backgroundColor: colors.danger,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontSize: typography.small,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  cardType: {
    color: colors.carbon,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  message: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
});
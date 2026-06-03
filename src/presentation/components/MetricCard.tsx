import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { TankStatus } from "../../domain/models/Telemetry";

type MetricCardProps = {
  title: string;
  value: string;
  status?: TankStatus;
};

export function MetricCard({ title, value, status }: MetricCardProps) {
  function getStatusColor() {
    if (status === "CRITICO") {
      return colors.danger;
    }

    if (status === "ATENCAO") {
      return colors.warning;
    }

    return colors.success;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {status && (
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  badgeText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
});
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";

type StatusBadgeVariant = "success" | "warning" | "danger" | "neutral" | "carbon";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
};

export function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  function getBackgroundColor() {
    if (variant === "success") {
      return colors.success;
    }

    if (variant === "warning") {
      return colors.warning;
    }

    if (variant === "danger") {
      return colors.danger;
    }

    if (variant === "carbon") {
      return colors.carbon;
    }

    return colors.muted;
  }

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
});
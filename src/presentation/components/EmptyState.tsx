import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    color: colors.muted,
    fontSize: typography.caption,
    textAlign: "center",
    lineHeight: 20,
  },
});
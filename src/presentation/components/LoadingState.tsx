import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Carregando...",
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  message: {
    color: colors.secondary,
    fontSize: typography.body,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
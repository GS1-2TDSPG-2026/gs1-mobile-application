import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../core/theme";
import { PrimaryButton } from "./PrimaryButton";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <PrimaryButton
          title="Tentar novamente"
          onPress={onRetry}
          variant="primary"
        />
      )}
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
  title: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    color: colors.secondary,
    fontSize: typography.body,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
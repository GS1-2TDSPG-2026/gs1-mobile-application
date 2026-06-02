import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { colors, spacing, typography } from "../../core/theme";

type ButtonVariant = "primary" | "danger" | "outline";

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
};

export function PrimaryButton({
  title,
  loading = false,
  variant = "primary",
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" && styles.primary,
        variant === "danger" && styles.danger,
        variant === "outline" && styles.outline,
        isDisabled && styles.disabled,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.textLight} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "outline" && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },
  outlineText: {
    color: colors.primary,
  },
});
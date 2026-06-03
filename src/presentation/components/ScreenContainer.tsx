import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { colors, spacing } from "../../core/theme";

type ScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
});
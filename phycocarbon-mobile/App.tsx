import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "./src/core/theme";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoCard}>
        <Image
          source={require("./assets/images/phycocarbon-splash-icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Phycocarbon</Text>

      <Text style={styles.subtitle}>
        Inteligência espacial para microalgas, segurança alimentar e créditos de carbono.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar aplicativo</Text>
      </TouchableOpacity>
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
  logoCard: {
    width: 180,
    height: 180,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },
});
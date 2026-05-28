import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { useAuth } from "../../contexts/AuthContext";

export function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("operador@phycocarbon.com");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      await signIn({
        email,
        senha,
      });
    } catch {
      Alert.alert(
        "Erro no login",
        "Use operador@phycocarbon.com, investidor@phycocarbon.com ou comprador@phycocarbon.com com senha 123456."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/phycocarbon-splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Phycocarbon</Text>

      <Text style={styles.subtitle}>
        Acesse sua operação de microalgas, carbono e marketplace.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.textLight} />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>
        Demo: operador@phycocarbon.com | investidor@phycocarbon.com | comprador@phycocarbon.com
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body,
    marginBottom: spacing.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },
  hint: {
    color: colors.secondary,
    fontSize: typography.small,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
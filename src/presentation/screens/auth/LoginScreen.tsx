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
import { useNavigation } from "@react-navigation/native";

export function LoginScreen() {
  const { signIn } = useAuth();

  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("[EMAIL_ADDRESS]");
  const [senha, setSenha] = useState("[PASSWORD]");
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
        "Verifique se a API Java está rodando e use um usuário existente do DML."
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

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerButtonText}>Criar nova conta</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Teste: joao.almeida@algaspace.com | contato@biocapital.com.br | compras@nutrialga.com.br
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
  registerButton: {
  borderColor: colors.primary,
  borderWidth: 1,
  borderRadius: 12,
  padding: spacing.md,
  alignItems: "center",
  marginTop: spacing.md,
},
registerButtonText: {
  color: colors.primary,
  fontSize: typography.body,
  fontWeight: "bold",
},
});
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, typography } from "../../../core/theme";
import { useAuth } from "../../contexts/AuthContext";

const testAccounts = [
  {
    label: "Operador",
    email: "joao.almeida@algaspace.com",
    senha: "Operador@2026",
  },
  {
    label: "Investidor",
    email: "contato@biocapital.com.br",
    senha: "Investidor@2026",
  },
  {
    label: "Comprador",
    email: "compras@nutrialga.com.br",
    senha: "Comprador@2026",
  },
];

export function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      await signIn({
        email: email.trim(),
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

  function handleUseTestAccount(account: (typeof testAccounts)[number]) {
    setEmail(account.email);
    setSenha(account.senha);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image
                source={require("../../../../assets/images/phycocarbon-splash-icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.badge}>GS 2026 • Space-to-Agro</Text>

            <Text style={styles.title}>Phycocarbon</Text>

            <Text style={styles.subtitle}>
              Monitore microalgas, créditos de carbono e marketplace em uma
              única operação.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acessar conta</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={senha}
                  onChangeText={setSenha}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setMostrarSenha((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
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
              activeOpacity={0.85}
            >
              <Text style={styles.registerButtonText}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.testCard}>
            <Text style={styles.testTitle}>Contas de teste</Text>

            <Text style={styles.testDescription}>
              Toque em um perfil para preencher o login automaticamente.
            </Text>

            {testAccounts.map((account) => (
              <TouchableOpacity
                key={account.email}
                style={styles.testAccountButton}
                onPress={() => handleUseTestAccount(account)}
                activeOpacity={0.85}
              >
                <View style={styles.testAccountInfo}>
                  <Text style={styles.testAccountLabel}>{account.label}</Text>
                  <Text style={styles.testAccountEmail}>{account.email}</Text>
                </View>

                <Text style={styles.testAccountAction}>Usar</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(142, 230, 209, 0.24)",
  },

  logo: {
    width: 60,
    height: 60,
  },

  badge: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },

  title: {
    color: colors.textLight,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  subtitle: {
    color: colors.secondary,
    fontSize: typography.caption,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },

  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },

  fieldGroup: {
    marginBottom: spacing.md,
  },

  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 54,
    fontSize: typography.body,
    color: colors.text,
  },

  passwordContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    height: 54,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },

  eyeButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
  },

  registerButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },

  registerButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "800",
  },

  testCard: {
    backgroundColor: "rgba(142, 230, 209, 0.08)",
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(142, 230, 209, 0.18)",
  },

  testTitle: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },

  testDescription: {
    color: colors.secondary,
    fontSize: typography.small,
    lineHeight: 18,
    marginBottom: spacing.md,
  },

  testAccountButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  testAccountInfo: {
    flex: 1,
  },

  testAccountLabel: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: "800",
    marginBottom: 2,
  },

  testAccountEmail: {
    color: colors.secondary,
    fontSize: typography.small,
  },

  testAccountAction: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "800",
  },
});
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { UserRole } from "../../../domain/models/Auth";
import { PrimaryButton } from "../../components/PrimaryButton";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<UserRole>("OPERADOR_CAMPO");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await signUp({
        nome,
        email,
        senha,
        perfil,
      });
    } catch (error) {
      Alert.alert(
        "Erro no cadastro",
        "Não foi possível cadastrar. Verifique os dados informados."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderProfileButton(label: string, value: UserRole) {
    const isActive = perfil === value;

    return (
      <TouchableOpacity
        style={[styles.profileButton, isActive && styles.profileButtonActive]}
        onPress={() => setPerfil(value)}
      >
        <Text
          style={[
            styles.profileButtonText,
            isActive && styles.profileButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color={colors.textLight} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          Cadastre um usuário real na API Java para acessar o app por perfil.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.muted}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.label}>Perfil de acesso</Text>

          <View style={styles.profileSelector}>
            {renderProfileButton("Operador", "OPERADOR_CAMPO")}
            {renderProfileButton("Investidor", "INVESTIDOR")}
            {renderProfileButton("Comprador", "COMPRADOR_B2B")}
          </View>

          <View style={styles.selectedProfile}>
            <StatusBadge label={perfil} variant="carbon" />
          </View>

          <View style={styles.buttonBox}>
            <PrimaryButton
              title="Cadastrar"
              onPress={handleRegister}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  backText: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
  profileSelector: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  profileButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  profileButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  profileButtonText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileButtonTextActive: {
    color: colors.textLight,
  },
  selectedProfile: {
    marginBottom: spacing.lg,
  },
  buttonBox: {
    marginTop: spacing.sm,
  },
});
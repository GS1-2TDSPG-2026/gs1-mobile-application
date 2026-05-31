import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import {
  MarketplaceLot,
  MarketplaceLotType,
} from "../../../domain/models/MarketplaceLot";
import { useMarketplace } from "../../hooks/useMarketplace";

export function MarketplaceScreen() {
  const {
    lots,
    loading,
    submitting,
    processingId,
    error,
    reload,
    createLot,
    updateStatus,
    deleteLot,
  } = useMarketplace();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<MarketplaceLotType>("BIOMASSA");
  const [pesoKg, setPesoKg] = useState("");
  const [preco, setPreco] = useState("");
  const [fazendaOrigem, setFazendaOrigem] = useState("");

  async function handleCreateLot() {
    if (!nome.trim() || !preco.trim() || !fazendaOrigem.trim()) {
      Alert.alert("Campos obrigatórios", "Informe nome, preço e fazenda.");
      return;
    }

    const parsedPeso = tipo === "CREDITO_CARBONO" ? 0 : Number(pesoKg);
    const parsedPreco = Number(preco);

    if (Number.isNaN(parsedPreco) || parsedPreco <= 0) {
      Alert.alert("Preço inválido", "Informe um preço válido.");
      return;
    }

    if (tipo === "BIOMASSA" && (Number.isNaN(parsedPeso) || parsedPeso <= 0)) {
      Alert.alert("Peso inválido", "Informe o peso em kg do lote.");
      return;
    }

    await createLot({
      nome,
      tipo,
      pesoKg: parsedPeso,
      preco: parsedPreco,
      fazendaOrigem,
    });

    setNome("");
    setPesoKg("");
    setPreco("");
    setFazendaOrigem("");
    setTipo("BIOMASSA");
  }

  function getStatusColor(item: MarketplaceLot) {
    if (item.status === "VENDIDO") {
      return colors.muted;
    }

    if (item.status === "RESERVADO") {
      return colors.warning;
    }

    return colors.success;
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando marketplace...</Text>
      </View>
    );
  }

  if (error && lots.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={lots}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Marketplace</Text>

            <Text style={styles.subtitle}>
              Cadastro e negociação de biomassa e créditos de carbono.
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Cadastrar novo lote</Text>

              <TextInput
                style={styles.input}
                placeholder="Nome do lote"
                placeholderTextColor={colors.muted}
                value={nome}
                onChangeText={setNome}
              />

              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    tipo === "BIOMASSA" && styles.typeButtonActive,
                  ]}
                  onPress={() => setTipo("BIOMASSA")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      tipo === "BIOMASSA" && styles.typeButtonTextActive,
                    ]}
                  >
                    Biomassa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    tipo === "CREDITO_CARBONO" && styles.typeButtonActive,
                  ]}
                  onPress={() => setTipo("CREDITO_CARBONO")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      tipo === "CREDITO_CARBONO" &&
                        styles.typeButtonTextActive,
                    ]}
                  >
                    Carbono
                  </Text>
                </TouchableOpacity>
              </View>

              {tipo === "BIOMASSA" && (
                <TextInput
                  style={styles.input}
                  placeholder="Peso em kg"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={pesoKg}
                  onChangeText={setPesoKg}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Preço"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={preco}
                onChangeText={setPreco}
              />

              <TextInput
                style={styles.input}
                placeholder="Fazenda de origem"
                placeholderTextColor={colors.muted}
                value={fazendaOrigem}
                onChangeText={setFazendaOrigem}
              />

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateLot}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.textLight} />
                ) : (
                  <Text style={styles.createButtonText}>Cadastrar lote</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Lotes disponíveis</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum lote cadastrado</Text>
            <Text style={styles.emptyText}>
              Cadastre um lote para começar a simular o marketplace.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(item),
                },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.nome}</Text>

            <Text style={styles.info}>
              Tipo: {item.tipo === "BIOMASSA" ? "Biomassa" : "Crédito de carbono"}
            </Text>

            {item.tipo === "BIOMASSA" && (
              <Text style={styles.info}>Peso: {item.pesoKg} kg</Text>
            )}

            <Text style={styles.info}>Origem: {item.fazendaOrigem}</Text>

            <Text style={styles.price}>
              R$ {item.preco.toLocaleString("pt-BR")}
            </Text>

            <View style={styles.actions}>
              {item.status === "DISPONIVEL" && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => updateStatus(item.id, "RESERVADO")}
                  disabled={processingId === item.id}
                >
                  <Text style={styles.secondaryButtonText}>Reservar</Text>
                </TouchableOpacity>
              )}

              {item.status !== "VENDIDO" && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => updateStatus(item.id, "VENDIDO")}
                  disabled={processingId === item.id}
                >
                  <Text style={styles.primaryButtonText}>Vender</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteLot(item.id)}
                disabled={processingId === item.id}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>

            {processingId === item.id && (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            )}
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
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
    marginBottom: spacing.lg,
  },
  loadingText: {
    color: colors.secondary,
    fontSize: typography.body,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.textLight,
    fontSize: typography.body,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
  },
  retryButtonText: {
    color: colors.textLight,
    fontWeight: "bold",
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  formTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.md,
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
  typeSelector: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    borderColor: colors.carbon,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.carbon,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  typeButtonTextActive: {
    color: colors.textLight,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
  },
  createButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  statusText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  info: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  primaryButtonText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: colors.warning,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  deleteButtonText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  loader: {
    marginTop: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.muted,
    fontSize: typography.caption,
    textAlign: "center",
  },
});
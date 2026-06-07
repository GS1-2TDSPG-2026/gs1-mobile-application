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
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, typography } from "../../../core/theme";
import {
  MarketplaceLot,
  MarketplaceLotStatus,
} from "../../../domain/models/MarketplaceLot";
import { useMarketplace } from "../../hooks/useMarketplace";

type MarketplaceTab = {
  label: string;
  status: MarketplaceLotStatus;
  icon: keyof typeof Ionicons.glyphMap;
};

const tabs: MarketplaceTab[] = [
  {
    label: "Disponíveis",
    status: "DISPONIVEL",
    icon: "storefront-outline",
  },
  {
    label: "Reservados",
    status: "RESERVADO",
    icon: "time-outline",
  },
  {
    label: "Vendidos",
    status: "VENDIDO",
    icon: "checkmark-circle-outline",
  },
];

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
  buyLot,
} = useMarketplace();

  const [nome, setNome] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [preco, setPreco] = useState("");
  const [fazendaOrigem, setFazendaOrigem] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<MarketplaceLotStatus>("DISPONIVEL");

  const filteredLots = lots.filter((lot) => lot.status === activeStatus);

  const availableCount = lots.filter(
    (lot) => lot.status === "DISPONIVEL"
  ).length;

  const reservedCount = lots.filter(
    (lot) => lot.status === "RESERVADO"
  ).length;

  const soldCount = lots.filter((lot) => lot.status === "VENDIDO").length;

  async function handleCreateLot() {
    if (!nome.trim() || !pesoKg.trim() || !preco.trim() || !fazendaOrigem.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe nome, peso, preço e fazenda de origem."
      );
      return;
    }

    const parsedPeso = Number(pesoKg);
    const parsedPreco = Number(preco);

    if (Number.isNaN(parsedPeso) || parsedPeso <= 0) {
      Alert.alert("Peso inválido", "Informe o peso em kg do lote.");
      return;
    }

    if (Number.isNaN(parsedPreco) || parsedPreco <= 0) {
      Alert.alert("Preço inválido", "Informe um preço válido.");
      return;
    }

    await createLot({
      nome: nome.trim(),
      tipo: "BIOMASSA",
      pesoKg: parsedPeso,
      preco: parsedPreco,
      fazendaOrigem: fazendaOrigem.trim(),
    });

    setNome("");
    setPesoKg("");
    setPreco("");
    setFazendaOrigem("");
    setActiveStatus("DISPONIVEL");
  }

  function getStatusColor(status: MarketplaceLotStatus) {
    if (status === "VENDIDO") {
      return colors.success;
    }

    if (status === "RESERVADO") {
      return colors.warning;
    }

    return colors.primary;
  }

  function getStatusLabel(status: MarketplaceLotStatus) {
    if (status === "VENDIDO") {
      return "Vendido";
    }

    if (status === "RESERVADO") {
      return "Reservado";
    }

    if (status === "CANCELADO") {
      return "Cancelado";
    }

    return "Disponível";
  }

  function getTabCount(status: MarketplaceLotStatus) {
    if (status === "DISPONIVEL") {
      return availableCount;
    }

    if (status === "RESERVADO") {
      return reservedCount;
    }

    if (status === "VENDIDO") {
      return soldCount;
    }

    return 0;
  }

  function getEmptyMessage() {
    if (activeStatus === "DISPONIVEL") {
      return {
        title: "Nenhum lote disponível",
        text: "Cadastre um lote de biomassa para ele aparecer nesta aba.",
      };
    }

    if (activeStatus === "RESERVADO") {
      return {
        title: "Nenhum lote reservado",
        text: "Quando um lote for reservado, ele aparecerá aqui.",
      };
    }

    return {
      title: "Nenhum lote vendido",
      text: "Quando uma venda for finalizada, o lote aparecerá aqui com o check de confirmação.",
    };
  }

  function renderTabs() {
    return (
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.status;

          return (
            <TouchableOpacity
              key={tab.status}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveStatus(tab.status)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={isActive ? colors.textLight : colors.secondary}
              />

              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.tabCount,
                  isActive && styles.tabCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    isActive && styles.tabCountTextActive,
                  ]}
                >
                  {getTabCount(tab.status)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderLotCard({ item }: { item: MarketplaceLot }) {
    const isSold = item.status === "VENDIDO";
    const isReserved = item.status === "RESERVADO";
    const isAvailable = item.status === "DISPONIVEL";

    return (
      <View style={[styles.card, isSold && styles.soldCard]}>
        {isSold && (
          <View style={styles.soldCheck}>
            <Ionicons name="checkmark" size={18} color={colors.textLight} />
          </View>
        )}

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>

        <Text style={styles.cardTitle}>{item.nome}</Text>

        <Text style={styles.info}>Tipo: Biomassa</Text>

        <Text style={styles.info}>Peso: {item.pesoKg} kg</Text>

        <Text style={styles.info}>Origem: {item.fazendaOrigem}</Text>

        {item.taxonomiaAlga && (
          <Text style={styles.info}>Alga: {item.taxonomiaAlga}</Text>
        )}

        {item.codigoTanque && (
          <Text style={styles.info}>Tanque: {item.codigoTanque}</Text>
        )}

        {item.precoUnitario ? (
          <Text style={styles.info}>
            Preço/kg: R$ {item.precoUnitario.toLocaleString("pt-BR")}
          </Text>
        ) : null}

        <Text style={styles.price}>
          Total: R$ {item.preco.toLocaleString("pt-BR")}
        </Text>

        <View style={styles.actions}>
          {isAvailable && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => updateStatus(item.id, "RESERVADO")}
              disabled={processingId === item.id}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Reservar</Text>
            </TouchableOpacity>
          )}

          {isAvailable && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                Alert.alert(
                  "Comprar lote",
                  `Deseja comprar o lote "${item.nome}" por R$ ${item.preco.toLocaleString(
                    "pt-BR"
                  )}?`,
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Comprar",
                      onPress: async () => {
                        try {
                          await buyLot(item);
                          Alert.alert(
                            "Compra realizada",
                            "A transação foi registrada no banco e o lote foi marcado como vendido."
                          );
                        } catch {
                          Alert.alert(
                            "Erro na compra",
                            "Não foi possível comprar este lote. Ele pode não estar disponível."
                          );
                        }
                      },
                    },
                  ]
                );
              }}
              disabled={processingId === item.id}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Comprar</Text>
            </TouchableOpacity>
          )}

          {!isSold ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteLot(item.id)}
              disabled={processingId === item.id}
              activeOpacity={0.85}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.finalizedBadge}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.success} />
              <Text style={styles.finalizedBadgeText}>Venda finalizada</Text>
            </View>
          )}
        </View>

        {processingId === item.id && (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </View>
    );
  }

  function renderHeader() {
    return (
      <View>
        <Text style={styles.title}>Marketplace</Text>

        <Text style={styles.subtitle}>
          Cadastro e negociação de lotes de biomassa de microalgas.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Cadastrar lote de biomassa</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome ou taxonomia da alga"
            placeholderTextColor={colors.muted}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Peso em kg"
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={pesoKg}
            onChangeText={setPesoKg}
          />

          <TextInput
            style={styles.input}
            placeholder="Preço por kg"
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
            style={[styles.createButton, submitting && styles.buttonDisabled]}
            onPress={handleCreateLot}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <Text style={styles.createButtonText}>Cadastrar lote</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{availableCount}</Text>
            <Text style={styles.summaryLabel}>Disponíveis</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{reservedCount}</Text>
            <Text style={styles.summaryLabel}>Reservados</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{soldCount}</Text>
            <Text style={styles.summaryLabel}>Vendidos</Text>
          </View>
        </View>

        {renderTabs()}
      </View>
    );
  }

  function renderEmpty() {
    const emptyMessage = getEmptyMessage();

    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>{emptyMessage.title}</Text>
        <Text style={styles.emptyText}>{emptyMessage.text}</Text>
      </View>
    );
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
        data={filteredLots}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLotCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.lg,
    lineHeight: 22,
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
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  formTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
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

  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  createButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "bold",
  },

  summaryRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(142, 230, 209, 0.08)",
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(142, 230, 209, 0.18)",
    marginRight: spacing.sm,
  },

  summaryNumber: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: 2,
  },

  summaryLabel: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: "700",
  },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 18,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(142, 230, 209, 0.16)",
  },

  tabButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    paddingHorizontal: 6,
    alignItems: "center",
  },

  tabButtonActive: {
    backgroundColor: colors.primary,
  },

  tabText: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: "800",
    marginTop: 4,
  },

  tabTextActive: {
    color: colors.textLight,
  },

  tabCount: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(142, 230, 209, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 6,
  },

  tabCountActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  tabCountText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: "800",
  },

  tabCountTextActive: {
    color: colors.textLight,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    position: "relative",
    overflow: "hidden",
  },

  soldCard: {
    borderWidth: 1,
    borderColor: colors.success,
  },

  soldCheck: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
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
    fontWeight: "800",
    marginBottom: spacing.sm,
    paddingRight: 44,
  },

  info: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginTop: spacing.md,
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.lg,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
    lineHeight: 20,
  },finalizedBadge: {
  flexDirection: "row",
  alignItems: "center",
  borderColor: colors.success,
  borderWidth: 1,
  borderRadius: 10,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
  marginBottom: spacing.sm,
},

finalizedBadgeText: {
  color: colors.success,
  fontSize: typography.small,
  fontWeight: "bold",
  marginLeft: 6,
},
});
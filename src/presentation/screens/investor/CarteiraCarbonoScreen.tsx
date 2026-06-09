import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, typography } from "../../../core/theme";
import {
  CarbonCredit,
  CarbonCreditStatus,
} from "../../../domain/models/CarbonCredit";
import { useCarbonWallet } from "../../hooks/useCarbonWallet";

export function CarteiraCarbonoScreen() {
  const { wallet, loading, validatingId, error, reload, validateCredit } =
    useCarbonWallet();

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatCo2(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getStatusLabel(status: CarbonCreditStatus) {
    if (status === "DISPONIVEL") {
      return "Disponível";
    }

    if (status === "VALIDADO") {
      return "Validado";
    }

    if (status === "VENDIDO" || status === "NEGOCIADO") {
      return "Vendido";
    }

    return "Pendente";
  }

  function getStatusColor(status: CarbonCreditStatus) {
    if (status === "VALIDADO") {
      return colors.success;
    }

    if (status === "DISPONIVEL") {
      return colors.primary;
    }

    if (status === "PENDENTE") {
      return colors.warning;
    }

    return colors.carbon;
  }

  function getStatusIcon(status: CarbonCreditStatus) {
    if (status === "VALIDADO") {
      return "shield-checkmark-outline";
    }

    if (status === "DISPONIVEL") {
      return "leaf-outline";
    }

    if (status === "PENDENTE") {
      return "time-outline";
    }

    return "checkmark-circle-outline";
  }

  function shortHash(hash: string) {
    if (!hash || hash.length <= 18) {
      return hash;
    }

    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  }

  function handleValidateCredit(item: CarbonCredit) {
    Alert.alert(
      "Validar crédito",
      `Deseja validar o crédito ${item.codigo}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Validar",
          onPress: () => validateCredit(item.id),
        },
      ]
    );
  }

  function renderCreditCard({ item }: { item: CarbonCredit }) {
    const isValidated = item.status === "VALIDADO";
    const isSold = item.status === "VENDIDO" || item.status === "NEGOCIADO";
    const canValidate = !isValidated && !isSold;

    return (
      <View style={[styles.creditCard, isValidated && styles.validatedCard]}>
        {isValidated && (
          <View style={styles.validatedCheck}>
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
          <Ionicons
            name={getStatusIcon(item.status)}
            size={14}
            color={colors.textLight}
          />
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>

        <Text style={styles.creditCode}>{item.codigo}</Text>

        <Text style={styles.info}>Origem: {item.fazendaOrigem}</Text>
        <Text style={styles.info}>Lote vinculado: #{item.idLote}</Text>
        <Text style={styles.info}>
          CO₂: {formatCo2(item.quantidadeCo2)} tCO₂e
        </Text>
        <Text style={styles.info}>Validação: {item.dataValidacao}</Text>

        <View style={styles.hashBox}>
          <Text style={styles.hashLabel}>Hash de auditoria</Text>
          <Text style={styles.hash}>{shortHash(item.hashAuditoria)}</Text>
        </View>

        <Text style={styles.price}>{formatCurrency(item.valorEstimado)}</Text>

        {canValidate ? (
          <TouchableOpacity
            style={styles.validateButton}
            onPress={() => handleValidateCredit(item)}
            disabled={validatingId === item.id}
            activeOpacity={0.85}
          >
            {validatingId === item.id ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={colors.textLight}
                />
                <Text style={styles.validateButtonText}>Validar crédito</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.lockedBadge}>
            <Ionicons
              name={isSold ? "lock-closed-outline" : "shield-checkmark-outline"}
              size={14}
              color={isSold ? colors.carbon : colors.success}
            />
            <Text
              style={[
                styles.lockedBadgeText,
                {
                  color: isSold ? colors.carbon : colors.success,
                },
              ]}
            >
              {isSold ? "Crédito negociado" : "Crédito validado"}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando carteira de carbono...</Text>
      </View>
    );
  }

  if (error && !wallet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!wallet) {
    return null;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={wallet.creditos}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderCreditCard}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Carteira de Carbono</Text>

          <Text style={styles.subtitle}>
            Extrato ambiental e financeiro dos créditos de carbono auditáveis.
          </Text>

          {error ? (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>CO₂ sequestrado</Text>
              <Text style={styles.summaryValue}>
                {formatCo2(wallet.totalCo2)} tCO₂e
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Créditos disponíveis</Text>
              <Text style={styles.summaryValue}>
                {wallet.creditosDisponiveis}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Valor estimado</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(wallet.valorTotalEstimado)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Última validação</Text>
              <Text style={styles.summaryValueSmall}>
                {wallet.ultimaValidacao}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Créditos registrados</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum crédito encontrado</Text>
          <Text style={styles.emptyText}>
            Os créditos de carbono aparecerão aqui quando forem gerados no
            banco Oracle.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
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

  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },

  inlineError: {
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    borderColor: "rgba(220, 38, 38, 0.28)",
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  inlineErrorText: {
    color: colors.textLight,
    fontSize: typography.small,
  },

  summaryGrid: {
    marginBottom: spacing.xl,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  summaryLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  summaryValue: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  summaryValueSmall: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },

  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  creditCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    position: "relative",
    overflow: "hidden",
  },

  validatedCard: {
    borderWidth: 1,
    borderColor: colors.success,
  },

  validatedCheck: {
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginBottom: spacing.md,
  },

  statusText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
    marginLeft: 6,
  },

  creditCode: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.sm,
    paddingRight: 42,
  },

  info: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  hashBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },

  hashLabel: {
    color: colors.muted,
    fontSize: typography.small,
    marginBottom: 4,
  },

  hash: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "800",
  },

  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginTop: spacing.md,
  },

  validateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  validateButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
    marginLeft: 8,
  },

  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  lockedBadgeText: {
    fontSize: typography.small,
    fontWeight: "800",
    marginLeft: 8,
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
  },
});
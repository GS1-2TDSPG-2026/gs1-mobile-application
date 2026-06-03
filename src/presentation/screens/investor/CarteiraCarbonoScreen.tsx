import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { CarbonCredit } from "../../../domain/models/CarbonCredit";
import { useCarbonWallet } from "../../hooks/useCarbonWallet";

export function CarteiraCarbonoScreen() {
  const { wallet, loading, error, reload } = useCarbonWallet();

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function getStatusColor(item: CarbonCredit) {
    if (item.status === "VALIDADO") {
      return colors.success;
    }

    if (item.status === "PENDENTE") {
      return colors.warning;
    }

    return colors.carbon;
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando carteira de carbono...</Text>
      </View>
    );
  }

  if (error || !wallet) {
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
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={wallet.creditos}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Carteira de Carbono</Text>

          <Text style={styles.subtitle}>
            Extrato ambiental e financeiro dos créditos de carbono auditáveis.
          </Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>CO₂ sequestrado</Text>
              <Text style={styles.summaryValue}>{wallet.totalCo2} tCO₂e</Text>
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
      renderItem={({ item }) => (
        <View style={styles.creditCard}>
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

          <Text style={styles.creditCode}>{item.codigo}</Text>

          <Text style={styles.info}>Origem: {item.fazendaOrigem}</Text>
          <Text style={styles.info}>CO₂: {item.quantidadeCo2} tCO₂e</Text>
          <Text style={styles.info}>Validação: {item.dataValidacao}</Text>

          <Text style={styles.hash}>Hash: {item.hashAuditoria}</Text>

          <Text style={styles.price}>{formatCurrency(item.valorEstimado)}</Text>
        </View>
      )}
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
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.xl,
  },
  summaryGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  summaryValueSmall: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  creditCard: {
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
  creditCode: {
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
  hash: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginTop: spacing.sm,
  },
  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginTop: spacing.md,
  },
});
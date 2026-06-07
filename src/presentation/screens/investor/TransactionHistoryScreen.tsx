import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import {
  Transaction,
  TransactionStatus,
} from "../../../domain/models/Transaction";
import { useTransactions } from "../../hooks/useTransactions";

function getStatusColor(status: TransactionStatus) {
  if (status === "CONCLUIDA") {
    return colors.success;
  }

  if (status === "PENDENTE") {
    return colors.warning;
  }

  return colors.danger;
}

export function TransactionHistoryScreen() {
  const { summary, loading, error, reload } = useTransactions();

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function renderTransactionCard(item: Transaction) {
    return (
      <View style={styles.card}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <Text style={styles.transactionCode}>{item.codigo}</Text>
        <Text style={styles.description}>{item.descricao}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.info}>
            Tipo: {item.tipo === "COMPRA" ? "Compra" : "Venda"}
          </Text>

          <Text style={styles.info}>
            Ativo:{" "}
            {item.ativo === "BIOMASSA" ? "Biomassa" : "Crédito de carbono"}
          </Text>

          <Text style={styles.info}>
            Quantidade: {item.quantidade} {item.unidade}
          </Text>

          <Text style={styles.info}>Comprador: {item.comprador}</Text>
          <Text style={styles.info}>Vendedor: {item.vendedor}</Text>
          <Text style={styles.info}>Data: {item.data}</Text>
        </View>

        <Text style={styles.hash}>Referência: {item.hashAuditoria}</Text>

        <Text style={styles.price}>{formatCurrency(item.valor)}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error || !summary) {
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
      data={summary.transacoes}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Transações</Text>

          <Text style={styles.subtitle}>
            Histórico financeiro e comercial dos ativos negociados na plataforma.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total transacionado</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.totalTransacionado)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summarySmallCard}>
              <Text style={styles.summaryLabel}>Concluídas</Text>
              <Text style={styles.summaryValueSmall}>
                {summary.transacoesConcluidas}
              </Text>
            </View>

            <View style={styles.summarySmallCard}>
              <Text style={styles.summaryLabel}>Pendentes</Text>
              <Text style={styles.summaryValueSmall}>
                {summary.transacoesPendentes}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Histórico</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
          <Text style={styles.emptyText}>
            As compras e vendas aparecerão nesta tela.
          </Text>
        </View>
      }
      renderItem={({ item }) => renderTransactionCard(item)}
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  summarySmallCard: {
    flex: 1,
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
    fontSize: typography.title,
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
  transactionCode: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  description: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  infoBox: {
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  info: {
    color: colors.text,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  hash: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "bold",
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
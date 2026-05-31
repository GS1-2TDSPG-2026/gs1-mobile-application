import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { CriticalAlert } from "../../../domain/models/CriticalAlert";
import { useCriticalAlerts } from "../../hooks/useCriticalAlerts";

export function AlertasCriticosScreen() {
  const {
    alerts,
    filter,
    loading,
    resolvingId,
    error,
    setFilter,
    reload,
    resolveAlert,
  } = useCriticalAlerts();

  function getSeverityColor(alert: CriticalAlert) {
    if (alert.status === "RESOLVIDO") {
      return colors.muted;
    }

    if (alert.severidade === "CRITICO") {
      return colors.danger;
    }

    return colors.warning;
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando alertas...</Text>
      </View>
    );
  }

  if (error) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Alertas Críticos</Text>

      <Text style={styles.subtitle}>
        Acompanhe eventos de risco gerados por sensores IoT e regras de limite.
      </Text>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "ABERTOS" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("ABERTOS")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "ABERTOS" && styles.filterTextActive,
            ]}
          >
            Abertos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "RESOLVIDOS" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("RESOLVIDOS")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "RESOLVIDOS" && styles.filterTextActive,
            ]}
          >
            Resolvidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "TODOS" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("TODOS")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "TODOS" && styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum alerta encontrado</Text>
            <Text style={styles.emptyText}>
              Não existem alertas para o filtro selecionado.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View
              style={[
                styles.severityBadge,
                {
                  backgroundColor: getSeverityColor(item),
                },
              ]}
            >
              <Text style={styles.severityText}>{item.severidade}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.tanque}</Text>
            <Text style={styles.cardType}>{item.tipo}</Text>
            <Text style={styles.message}>{item.mensagem}</Text>

            <View style={styles.footer}>
              <Text style={styles.date}>{item.criadoEm}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            {item.status === "ABERTO" && (
              <TouchableOpacity
                style={styles.resolveButton}
                onPress={() => resolveAlert(item.id)}
                disabled={resolvingId === item.id}
              >
                {resolvingId === item.id ? (
                  <ActivityIndicator color={colors.textLight} />
                ) : (
                  <Text style={styles.resolveButtonText}>
                    Marcar como resolvido
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
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
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    flex: 1,
    borderColor: colors.carbon,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: colors.textLight,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  severityText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  cardType: {
    color: colors.carbon,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  message: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  date: {
    color: colors.muted,
    fontSize: typography.small,
  },
  status: {
    color: colors.carbon,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  resolveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  resolveButtonText: {
    color: colors.textLight,
    fontSize: typography.caption,
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
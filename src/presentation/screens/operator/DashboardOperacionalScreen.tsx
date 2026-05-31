import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import { MetricCard } from "../../components/MetricCard";
import { useAuth } from "../../contexts/AuthContext";
import { useTelemetryDashboard } from "../../hooks/useTelemetryDashboard";

export function DashboardOperacionalScreen() {
  const { session } = useAuth();
  const { dashboard, loading, error, reload } = useTelemetryDashboard();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando telemetria...</Text>
      </View>
    );
  }

  if (error || !dashboard) {
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
      data={dashboard.metricas}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Dashboard Operacional</Text>

          <Text style={styles.subtitle}>
            Olá, {session?.usuario.nome}. Monitoramento da fazenda{" "}
            {dashboard.fazendaNome}.
          </Text>

          <MetricCard
            title="Status ESP32"
            value={dashboard.dispositivoStatus}
            status={dashboard.dispositivoStatus === "ONLINE" ? "NORMAL" : "CRITICO"}
          />

          <MetricCard
            title="Previsão IA"
            value={dashboard.previsaoBiomassa}
            status="NORMAL"
          />

          <MetricCard
            title="Confiança do modelo"
            value={`${dashboard.confiancaIA}%`}
            status={dashboard.confiancaIA >= 80 ? "NORMAL" : "ATENCAO"}
          />

          <Text style={styles.sectionTitle}>Tanques monitorados</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tankCard}>
          <View style={styles.tankHeader}>
            <Text style={styles.tankName}>{item.nomeTanque}</Text>
            <Text style={styles.lastRead}>{item.ultimaLeitura}</Text>
          </View>

          <Text style={styles.metric}>pH: {item.ph}</Text>
          <Text style={styles.metric}>Temperatura: {item.temperatura}°C</Text>
          <Text style={styles.metric}>Turbidez: {item.turbidez} NTU</Text>
          <Text style={styles.metric}>Luminosidade: {item.luminosidade} lx</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "CRITICO"
                    ? colors.danger
                    : item.status === "ATENCAO"
                    ? colors.warning
                    : colors.success,
              },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
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
  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  tankCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  tankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tankName: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    flex: 1,
  },
  lastRead: {
    color: colors.muted,
    fontSize: typography.small,
  },
  metric: {
    color: colors.text,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  statusText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
});
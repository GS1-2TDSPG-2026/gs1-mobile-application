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
  OrbitalData,
  OrbitalRiskLevel,
} from "../../../domain/models/OrbitalData";
import { useOrbitalData } from "../../hooks/useOrbitalData";

function getRiskColor(risco: OrbitalRiskLevel) {
  if (risco === "ALTO") {
    return colors.danger;
  }

  if (risco === "MEDIO") {
    return colors.warning;
  }

  return colors.success;
}

export function OrbitalDataScreen() {
  const { summary, loading, error, reload } = useOrbitalData();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados orbitais...</Text>
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

  function renderOrbitalCard(item: OrbitalData) {
    return (
      <View style={styles.card}>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor: getRiskColor(item.riscoOperacional),
            },
          ]}
        >
          <Text style={styles.riskText}>RISCO {item.riscoOperacional}</Text>
        </View>

        <Text style={styles.source}>{item.fonte}</Text>
        <Text style={styles.location}>{item.localizacao}</Text>

        <View style={styles.metricBox}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Radiação PAR</Text>
            <Text style={styles.metricValue}>{item.radiacaoPAR} μmol/m²/s</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Índice UV</Text>
            <Text style={styles.metricValue}>{item.indiceUV}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Nebulosidade</Text>
            <Text style={styles.metricValue}>{item.nebulosidade}%</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Temperatura externa</Text>
            <Text style={styles.metricValue}>{item.temperaturaExterna}°C</Text>
          </View>
        </View>

        <Text style={styles.weatherTitle}>Previsão climática</Text>
        <Text style={styles.weatherText}>{item.previsaoClima}</Text>

        <Text style={styles.impactTitle}>Impacto na biomassa</Text>
        <Text style={styles.impactText}>{item.impactoNaBiomassa}</Text>

        <Text style={styles.updated}>Atualizado {item.atualizadoEm}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={summary.dados}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Dados Orbitais</Text>

          <Text style={styles.subtitle}>
            Métricas espaciais usadas para calibrar o cultivo e apoiar a IA.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Fazenda monitorada</Text>
            <Text style={styles.summaryValue}>{summary.fazendaNome}</Text>

            <Text style={styles.summaryLabel}>Coordenadas</Text>
            <Text style={styles.summaryValue}>
              {summary.latitude}, {summary.longitude}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Fontes orbitais</Text>
        </View>
      }
      renderItem={({ item }) => renderOrbitalCard(item)}
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
    marginBottom: spacing.xl,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "bold",
    marginTop: spacing.xs,
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
  riskBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  riskText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  source: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  location: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  metricBox: {
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    flex: 1,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
  weatherTitle: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginTop: spacing.sm,
  },
  weatherText: {
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  impactTitle: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginTop: spacing.md,
  },
  impactText: {
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  updated: {
    color: colors.muted,
    fontSize: typography.small,
    marginTop: spacing.md,
  },
});
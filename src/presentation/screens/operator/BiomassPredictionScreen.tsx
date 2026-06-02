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
  BiomassPrediction,
  PredictionRiskLevel,
} from "../../../domain/models/BiomassPrediction";
import { useBiomassPredictions } from "../../hooks/useBiomassPredictions";

function getRiskColor(risco: PredictionRiskLevel) {
  if (risco === "ALTO") {
    return colors.danger;
  }

  if (risco === "MEDIO") {
    return colors.warning;
  }

  return colors.success;
}

export function BiomassPredictionScreen() {
  const { summary, loading, error, reload } = useBiomassPredictions();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando previsões de IA...</Text>
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

  function renderPredictionCard(item: BiomassPrediction) {
    return (
      <View style={styles.card}>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor: getRiskColor(item.risco),
            },
          ]}
        >
          <Text style={styles.riskText}>RISCO {item.risco}</Text>
        </View>

        <Text style={styles.cardTitle}>{item.tanque}</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Biomassa atual</Text>
          <Text style={styles.metricValue}>{item.biomassaAtual} g/L</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Previsão 48h</Text>
          <Text style={styles.metricValue}>{item.biomassaPrevista48h} g/L</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Crescimento</Text>
          <Text style={styles.metricValue}>{item.crescimentoPercentual}%</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Confiança IA</Text>
          <Text style={styles.metricValue}>{item.confiancaModelo}%</Text>
        </View>

        <View style={styles.orbitalBox}>
          <Text style={styles.orbitalTitle}>Dados orbitais usados</Text>

          <Text style={styles.orbitalText}>PAR: {item.radiacaoPAR} μmol/m²/s</Text>
          <Text style={styles.orbitalText}>Índice UV: {item.indiceUV}</Text>
          <Text style={styles.orbitalText}>Nebulosidade: {item.nebulosidade}%</Text>
        </View>

        <Text style={styles.harvestLabel}>Colheita estimada</Text>
        <Text style={styles.harvestValue}>{item.dataColheitaEstimada}</Text>

        <Text style={styles.recommendation}>{item.recomendacao}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={summary.previsoes}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Previsões de IA</Text>

          <Text style={styles.subtitle}>
            Estimativa de crescimento de biomassa com base em sensores IoT e
            radiação orbital.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Fazenda</Text>
            <Text style={styles.summaryValue}>{summary.fazendaNome}</Text>

            <Text style={styles.summaryLabel}>Modelo</Text>
            <Text style={styles.summaryValue}>{summary.modeloIA}</Text>

            <Text style={styles.summaryLabel}>Última atualização</Text>
            <Text style={styles.summaryValue}>{summary.ultimaAtualizacao}</Text>
          </View>

          <Text style={styles.sectionTitle}>Tanques analisados</Text>
        </View>
      }
      renderItem={({ item }) => renderPredictionCard(item)}
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
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
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
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
  orbitalBox: {
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  orbitalTitle: {
    color: colors.carbon,
    fontSize: typography.caption,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  orbitalText: {
    color: colors.text,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  harvestLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
  harvestValue: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "bold",
    marginTop: spacing.xs,
  },
  recommendation: {
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 20,
    marginTop: spacing.md,
  },
});
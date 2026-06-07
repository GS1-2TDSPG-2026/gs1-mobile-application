import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { colors, spacing, typography } from "../../../core/theme";
import { Tank } from "../../../domain/models/Farm";
import { useFarmsAndTanks } from "../../hooks/useFarmsAndTanks";

function getStatusColor(status: string) {
  if (status === "ATIVO" || status === "ATIVA") {
    return colors.success;
  }

  if (status === "MANUTENCAO") {
    return colors.warning;
  }

  return colors.danger;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
}

function formatFarmName(name: string) {
  return name
    .replace("Estacao", "Est.")
    .replace("Estação", "Est.")
    .replace("Biologica", "Bio.")
    .replace("Biológica", "Bio.");
}

export function FazendasTanquesScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const {
    farms,
    selectedFarmId,
    selectedFarm,
    dashboard,
    tanks,
    loading,
    loadingDetails,
    error,
    reload,
    selectFarm,
  } = useFarmsAndTanks();

  function renderTankCard({ item }: { item: Tank }) {
    return (
      <View style={styles.tankCard}>
        <View style={styles.tankHeader}>
          <View style={styles.tankTitleBox}>
            <Text style={styles.tankCode}>{item.codigoTanque}</Text>
            <Text style={styles.tankSubtitle}>{item.tipoAlga}</Text>
          </View>

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
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Capacidade</Text>
            <Text style={styles.infoValue}>
              {formatNumber(item.capacidadeLitros)} L
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>pH ideal</Text>
            <Text style={styles.infoValue}>
              {item.phMin} - {item.phMax}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Temperatura</Text>
            <Text style={styles.infoValue}>
              {item.temperaturaMin}°C - {item.temperaturaMax}°C
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Instalação</Text>
            <Text style={styles.infoValue}>{item.dtInstalacao}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando fazendas e tanques...</Text>
      </View>
    );
  }

  if (error && farms.length === 0) {
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
  contentContainerStyle={[
    styles.content,
    {
      paddingBottom: tabBarHeight + 24,
    },
  ]}
  data={tanks}
  keyExtractor={(item) => String(item.id)}
  renderItem={renderTankCard}
  showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Fazendas e Tanques</Text>

          <Text style={styles.subtitle}>
            Gestão operacional das fazendas biológicas e biofotorreatores.
          </Text>

          {error ? (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.farmSelector}>
            {farms.map((farm) => {
              const isActive = selectedFarmId === farm.id;

              return (
                <TouchableOpacity
                  key={farm.id}
                  style={[styles.farmChip, isActive && styles.farmChipActive]}
                  onPress={() => selectFarm(farm.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.farmChipContent}>
                    <Text
                      style={[
                        styles.farmChipTitle,
                        isActive && styles.farmChipTitleActive,
                      ]}
                      numberOfLines={2}
                    >
                      {formatFarmName(farm.nome)}
                    </Text>

                    <Text
                      style={[
                        styles.farmChipSubtitle,
                        isActive && styles.farmChipSubtitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {farm.cidade}/{farm.uf}
                    </Text>
                  </View>

                  {isActive ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.textLight}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.secondary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedFarm ? (
            <View style={styles.farmCard}>
              <View style={styles.farmHeader}>
                <View style={styles.farmIcon}>
                  <Ionicons
                    name="leaf-outline"
                    size={22}
                    color={colors.textLight}
                  />
                </View>

                <View style={styles.farmTitleBox}>
                  <Text style={styles.farmName}>{selectedFarm.nome}</Text>
                  <Text style={styles.farmLocation}>
                    {selectedFarm.cidade}/{selectedFarm.uf}
                  </Text>
                </View>
              </View>

              <Text style={styles.farmInfo}>
                Responsável: {selectedFarm.nomeResponsavel}
              </Text>

              <Text style={styles.farmInfo}>
                Coordenadas: {selectedFarm.latitude}, {selectedFarm.longitude}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(selectedFarm.status),
                  },
                ]}
              >
                <Text style={styles.statusText}>{selectedFarm.status}</Text>
              </View>
            </View>
          ) : null}

          {dashboard ? (
            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardLabel}>Tanques</Text>
                <Text style={styles.dashboardValue}>
                  {dashboard.tanquesAtivos}/{dashboard.totalTanques}
                </Text>
              </View>

              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardLabel}>Lotes disponíveis</Text>
                <Text style={styles.dashboardValue}>
                  {dashboard.lotesDisponiveis}
                </Text>
              </View>

              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardLabel}>Créditos disponíveis</Text>
                <Text style={styles.dashboardValue}>
                  {dashboard.creditosDisponiveis}
                </Text>
              </View>

              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardLabel}>CO₂ total</Text>
                <Text style={styles.dashboardValueSmall}>
                  {formatNumber(dashboard.totalCo2Toneladas)} tCO₂e
                </Text>
              </View>
            </View>
          ) : null}

          {dashboard?.ultimoDadoOrbital ? (
            <View style={styles.orbitalCard}>
              <Text style={styles.orbitalTitle}>Último dado orbital</Text>

              <Text style={styles.orbitalInfo}>
                Fonte: {dashboard.ultimoDadoOrbital.fonte}
              </Text>

              <Text style={styles.orbitalInfo}>
                Coleta: {dashboard.ultimoDadoOrbital.dtColeta}
              </Text>

              <Text style={styles.orbitalInfo}>
                PAR: {dashboard.ultimoDadoOrbital.irradianciaParTot}
              </Text>

              <Text style={styles.orbitalInfo}>
                Nebulosidade: {dashboard.ultimoDadoOrbital.nebulosidade}%
              </Text>

              <Text style={styles.orbitalInfo}>
                Temperatura:{" "}
                {dashboard.ultimoDadoOrbital.temperaturaAmbiente}°C
              </Text>
            </View>
          ) : null}

          {loadingDetails ? (
            <View style={styles.loadingDetails}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingDetailsText}>
                Atualizando dados da fazenda...
              </Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Tanques da fazenda</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum tanque encontrado</Text>
          <Text style={styles.emptyText}>
            Os tanques cadastrados para esta fazenda aparecerão aqui.
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
    lineHeight: 22,
    marginBottom: spacing.lg,
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

  farmSelector: {
    marginBottom: spacing.lg,
  },

  farmChip: {
    width: "100%",
    minHeight: 64,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(142, 230, 209, 0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  farmChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  farmChipContent: {
    flex: 1,
    marginRight: spacing.sm,
  },

  farmChipTitle: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 17,
  },

  farmChipTitleActive: {
    color: colors.textLight,
  },

  farmChipSubtitle: {
    color: colors.secondary,
    fontSize: typography.small,
  },

  farmChipSubtitleActive: {
    color: colors.textLight,
  },

  farmCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  farmHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  farmIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  farmTitleBox: {
    flex: 1,
  },

  farmName: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  farmLocation: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: 2,
  },

  farmInfo: {
    color: colors.text,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },

  statusText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "800",
  },

  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  dashboardCard: {
    width: "48%",
    backgroundColor: "rgba(142, 230, 209, 0.08)",
    borderColor: "rgba(142, 230, 209, 0.18)",
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 92,
  },

  dashboardLabel: {
    color: colors.secondary,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  dashboardValue: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  dashboardValueSmall: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
  },

  orbitalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  orbitalTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  orbitalInfo: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },

  loadingDetails: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: "center",
  },

  loadingDetailsText: {
    color: colors.secondary,
    fontSize: typography.small,
    marginTop: spacing.sm,
  },

  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  tankCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  tankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  tankTitleBox: {
    flex: 1,
    marginRight: spacing.md,
  },

  tankCode: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  tankSubtitle: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: 2,
  },

  infoGrid: {
    marginTop: spacing.sm,
  },

  infoBox: {
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  infoLabel: {
    color: colors.muted,
    fontSize: typography.small,
    marginBottom: 2,
  },

  infoValue: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "800",
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
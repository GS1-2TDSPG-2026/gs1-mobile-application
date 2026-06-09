import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { colors, spacing, typography } from "../../../core/theme";
import { Farm, FarmStatus, Tank, TankStatus } from "../../../domain/models/Farm";
import { useFarmsAndTanks } from "../../hooks/useFarmsAndTanks";

const farmStatusOptions: FarmStatus[] = ["ATIVA", "INATIVA", "MANUTENCAO"];
const tankStatusOptions: TankStatus[] = ["ATIVO", "INATIVO", "MANUTENCAO"];

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

function parseNumber(value: string) {
  return Number(value.replace(",", "."));
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
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
    submitting,
    processingId,
    error,
    reload,
    selectFarm,
    createFarm,
    updateFarm,
    deleteFarm,
    createTank,
    updateTank,
    deleteTank,
  } = useFarmsAndTanks();

  const [farmModalVisible, setFarmModalVisible] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const [farmNome, setFarmNome] = useState("");
  const [farmCidade, setFarmCidade] = useState("");
  const [farmUf, setFarmUf] = useState("");
  const [farmLatitude, setFarmLatitude] = useState("");
  const [farmLongitude, setFarmLongitude] = useState("");
  const [farmStatus, setFarmStatus] = useState<FarmStatus>("ATIVA");

  const [tankModalVisible, setTankModalVisible] = useState(false);
  const [editingTank, setEditingTank] = useState<Tank | null>(null);

  const [tankCodigo, setTankCodigo] = useState("");
  const [tankTipoAlga, setTankTipoAlga] = useState("");
  const [tankCapacidade, setTankCapacidade] = useState("");
  const [tankPhMin, setTankPhMin] = useState("");
  const [tankPhMax, setTankPhMax] = useState("");
  const [tankTemperaturaMin, setTankTemperaturaMin] = useState("");
  const [tankTemperaturaMax, setTankTemperaturaMax] = useState("");
  const [tankDtInstalacao, setTankDtInstalacao] = useState(getToday());
  const [tankStatus, setTankStatus] = useState<TankStatus>("ATIVO");

  function openCreateFarmModal() {
    setEditingFarm(null);
    setFarmNome("");
    setFarmCidade("");
    setFarmUf("");
    setFarmLatitude("");
    setFarmLongitude("");
    setFarmStatus("ATIVA");
    setFarmModalVisible(true);
  }

  function openEditFarmModal(farm: Farm) {
    setEditingFarm(farm);
    setFarmNome(farm.nome);
    setFarmCidade(farm.cidade);
    setFarmUf(farm.uf);
    setFarmLatitude(String(farm.latitude));
    setFarmLongitude(String(farm.longitude));
    setFarmStatus(farm.status);
    setFarmModalVisible(true);
  }

  function closeFarmModal() {
    if (submitting) {
      return;
    }

    setFarmModalVisible(false);
    setEditingFarm(null);
  }

  async function handleSaveFarm() {
    if (
      !farmNome.trim() ||
      !farmCidade.trim() ||
      !farmUf.trim() ||
      !farmLatitude.trim() ||
      !farmLongitude.trim()
    ) {
      Alert.alert("Campos obrigatórios", "Preencha todos os dados da fazenda.");
      return;
    }

    const latitude = parseNumber(farmLatitude);
    const longitude = parseNumber(farmLongitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      Alert.alert("Coordenadas inválidas", "Informe latitude e longitude válidas.");
      return;
    }

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, {
          nome: farmNome.trim(),
          cidade: farmCidade.trim(),
          uf: farmUf.trim().toUpperCase(),
          latitude,
          longitude,
          status: farmStatus,
        });
      } else {
        await createFarm({
          nome: farmNome.trim(),
          cidade: farmCidade.trim(),
          uf: farmUf.trim().toUpperCase(),
          latitude,
          longitude,
        });
      }

      closeFarmModal();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a fazenda.");
    }
  }

  function handleDeleteFarm(farm: Farm) {
    Alert.alert(
      "Excluir fazenda",
      `Deseja excluir a fazenda "${farm.nome}"? Essa ação pode falhar se houver tanques, lotes ou créditos vinculados.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFarm(farm.id);
            } catch {
              Alert.alert(
                "Não foi possível excluir",
                "A fazenda possui dados vinculados ou o backend bloqueou a exclusão."
              );
            }
          },
        },
      ]
    );
  }

  function openCreateTankModal() {
    if (!selectedFarmId) {
      Alert.alert("Selecione uma fazenda", "Escolha uma fazenda antes de cadastrar um tanque.");
      return;
    }

    setEditingTank(null);
    setTankCodigo("");
    setTankTipoAlga("");
    setTankCapacidade("");
    setTankPhMin("");
    setTankPhMax("");
    setTankTemperaturaMin("");
    setTankTemperaturaMax("");
    setTankDtInstalacao(getToday());
    setTankStatus("ATIVO");
    setTankModalVisible(true);
  }

  function openEditTankModal(tank: Tank) {
    setEditingTank(tank);
    setTankCodigo(tank.codigoTanque);
    setTankTipoAlga(tank.tipoAlga);
    setTankCapacidade(String(tank.capacidadeLitros));
    setTankPhMin(String(tank.phMin));
    setTankPhMax(String(tank.phMax));
    setTankTemperaturaMin(String(tank.temperaturaMin));
    setTankTemperaturaMax(String(tank.temperaturaMax));
    setTankDtInstalacao(tank.dtInstalacao);
    setTankStatus(tank.status);
    setTankModalVisible(true);
  }

  function closeTankModal() {
    if (submitting) {
      return;
    }

    setTankModalVisible(false);
    setEditingTank(null);
  }

  async function handleSaveTank() {
    if (
      !tankCodigo.trim() ||
      !tankTipoAlga.trim() ||
      !tankCapacidade.trim() ||
      !tankPhMin.trim() ||
      !tankPhMax.trim() ||
      !tankTemperaturaMin.trim() ||
      !tankTemperaturaMax.trim()
    ) {
      Alert.alert("Campos obrigatórios", "Preencha todos os dados do tanque.");
      return;
    }

    if (!selectedFarmId && !editingTank) {
      Alert.alert("Fazenda obrigatória", "Selecione uma fazenda para cadastrar o tanque.");
      return;
    }

    const capacidadeLitros = parseNumber(tankCapacidade);
    const phMin = parseNumber(tankPhMin);
    const phMax = parseNumber(tankPhMax);
    const temperaturaMin = parseNumber(tankTemperaturaMin);
    const temperaturaMax = parseNumber(tankTemperaturaMax);

    if (
      Number.isNaN(capacidadeLitros) ||
      Number.isNaN(phMin) ||
      Number.isNaN(phMax) ||
      Number.isNaN(temperaturaMin) ||
      Number.isNaN(temperaturaMax)
    ) {
      Alert.alert("Valores inválidos", "Informe apenas números válidos nos campos técnicos.");
      return;
    }

    if (phMin >= phMax) {
      Alert.alert("pH inválido", "O pH mínimo precisa ser menor que o pH máximo.");
      return;
    }

    if (temperaturaMin >= temperaturaMax) {
      Alert.alert(
        "Temperatura inválida",
        "A temperatura mínima precisa ser menor que a temperatura máxima."
      );
      return;
    }

    try {
      if (editingTank) {
        await updateTank(editingTank.id, editingTank.idFazenda, {
          tipoAlga: tankTipoAlga.trim(),
          capacidadeLitros,
          phMin,
          phMax,
          temperaturaMin,
          temperaturaMax,
          status: tankStatus,
        });
      } else {
        await createTank({
          idFazenda: selectedFarmId as number,
          codigoTanque: tankCodigo.trim(),
          tipoAlga: tankTipoAlga.trim(),
          capacidadeLitros,
          phMin,
          phMax,
          temperaturaMin,
          temperaturaMax,
          dtInstalacao: tankDtInstalacao.trim() || getToday(),
        });
      }

      closeTankModal();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o tanque.");
    }
  }

  function handleDeleteTank(tank: Tank) {
    Alert.alert(
      "Excluir tanque",
      `Deseja excluir o tanque "${tank.codigoTanque}"? Essa ação pode falhar se houver dispositivos, métricas ou lotes vinculados.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTank(tank.id, tank.idFazenda);
            } catch {
              Alert.alert(
                "Não foi possível excluir",
                "O tanque possui dados vinculados ou o backend bloqueou a exclusão."
              );
            }
          },
        },
      ]
    );
  }

  function renderStatusOptions<T extends string>(
    options: T[],
    selected: T,
    onSelect: (value: T) => void
  ) {
    return (
      <View style={styles.statusOptions}>
        {options.map((option) => {
          const isActive = selected === option;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusOptionButton,
                isActive && {
                  backgroundColor: getStatusColor(option),
                  borderColor: getStatusColor(option),
                },
              ]}
              onPress={() => onSelect(option)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  isActive && styles.statusOptionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

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
            <Text style={styles.infoValue}>{formatNumber(item.capacidadeLitros)} L</Text>
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

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditTankModal(item)}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={16} color={colors.textLight} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTank(item)}
            disabled={processingId === item.id}
            activeOpacity={0.85}
          >
            {processingId === item.id ? (
              <ActivityIndicator color={colors.textLight} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={16} color={colors.textLight} />
                <Text style={styles.actionButtonText}>Excluir</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderFarmModal() {
    return (
      <Modal visible={farmModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFarm ? "Editar fazenda" : "Nova fazenda"}
              </Text>

              <TouchableOpacity onPress={closeFarmModal} activeOpacity={0.85}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome da fazenda"
              placeholderTextColor={colors.muted}
              value={farmNome}
              onChangeText={setFarmNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Cidade"
              placeholderTextColor={colors.muted}
              value={farmCidade}
              onChangeText={setFarmCidade}
            />

            <TextInput
              style={styles.input}
              placeholder="UF"
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              maxLength={2}
              value={farmUf}
              onChangeText={setFarmUf}
            />

            <TextInput
              style={styles.input}
              placeholder="Latitude"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={farmLatitude}
              onChangeText={setFarmLatitude}
            />

            <TextInput
              style={styles.input}
              placeholder="Longitude"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={farmLongitude}
              onChangeText={setFarmLongitude}
            />

            {editingFarm ? (
              <>
                <Text style={styles.modalLabel}>Status</Text>
                {renderStatusOptions(farmStatusOptions, farmStatus, setFarmStatus)}
              </>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, submitting && styles.disabledButton]}
              onPress={handleSaveFarm}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.textLight} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingFarm ? "Salvar alterações" : "Cadastrar fazenda"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function renderTankModal() {
    return (
      <Modal visible={tankModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTank ? "Editar tanque" : "Novo tanque"}
              </Text>

              <TouchableOpacity onPress={closeTankModal} activeOpacity={0.85}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, editingTank && styles.inputDisabled]}
              placeholder="Código do tanque"
              placeholderTextColor={colors.muted}
              value={tankCodigo}
              onChangeText={setTankCodigo}
              editable={!editingTank}
            />

            <TextInput
              style={styles.input}
              placeholder="Tipo de alga"
              placeholderTextColor={colors.muted}
              value={tankTipoAlga}
              onChangeText={setTankTipoAlga}
            />

            <TextInput
              style={styles.input}
              placeholder="Capacidade em litros"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={tankCapacidade}
              onChangeText={setTankCapacidade}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="pH min"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={tankPhMin}
                onChangeText={setTankPhMin}
              />

              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="pH max"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={tankPhMax}
                onChangeText={setTankPhMax}
              />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Temp min"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={tankTemperaturaMin}
                onChangeText={setTankTemperaturaMin}
              />

              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Temp max"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={tankTemperaturaMax}
                onChangeText={setTankTemperaturaMax}
              />
            </View>

            {!editingTank ? (
              <TextInput
                style={styles.input}
                placeholder="Data de instalação AAAA-MM-DD"
                placeholderTextColor={colors.muted}
                value={tankDtInstalacao}
                onChangeText={setTankDtInstalacao}
              />
            ) : (
              <>
                <Text style={styles.modalLabel}>Status</Text>
                {renderStatusOptions(tankStatusOptions, tankStatus, setTankStatus)}
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, submitting && styles.disabledButton]}
              onPress={handleSaveTank}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.textLight} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingTank ? "Salvar alterações" : "Cadastrar tanque"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    <>
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

            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={openCreateFarmModal}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={18} color={colors.textLight} />
                <Text style={styles.primaryActionButtonText}>Nova fazenda</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryActionButton,
                  !selectedFarmId && styles.disabledButton,
                ]}
                onPress={openCreateTankModal}
                disabled={!selectedFarmId}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={18} color={colors.textLight} />
                <Text style={styles.primaryActionButtonText}>Novo tanque</Text>
              </TouchableOpacity>
            </View>

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

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditFarmModal(selectedFarm)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={colors.textLight}
                    />
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFarm(selectedFarm)}
                    disabled={processingId === selectedFarm.id}
                    activeOpacity={0.85}
                  >
                    {processingId === selectedFarm.id ? (
                      <ActivityIndicator color={colors.textLight} />
                    ) : (
                      <>
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={colors.textLight}
                        />
                        <Text style={styles.actionButtonText}>Excluir</Text>
                      </>
                    )}
                  </TouchableOpacity>
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

      {renderFarmModal()}
      {renderTankModal()}
    </>
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

  topActions: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },

  primaryActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: spacing.sm,
  },

  primaryActionButtonText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "800",
    marginLeft: 6,
  },

  disabledButton: {
    opacity: 0.65,
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

  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
  },

  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  actionButtonText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "800",
    marginLeft: 6,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    maxHeight: "92%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  modalTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  modalLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "800",
    marginBottom: spacing.sm,
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

  inputDisabled: {
    backgroundColor: "#f1f5f9",
    color: colors.muted,
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputHalf: {
    width: "48%",
  },

  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },

  statusOptionButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },

  statusOptionText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "800",
  },

  statusOptionTextActive: {
    color: colors.textLight,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },

  saveButtonText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: "800",
  },
});
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/theme";
import {
  ActuatorStatus,
  IoTCommandType,
} from "../../../domain/models/IoTDevice";
import { useIoTDevice } from "../../hooks/useIoTDevice";

type CommandButtonProps = {
  title: string;
  description: string;
  status: ActuatorStatus;
  command: IoTCommandType;
  processingCommand: IoTCommandType | null;
  onPress: (command: IoTCommandType) => void;
};

function CommandButton({
  title,
  description,
  status,
  command,
  processingCommand,
  onPress,
}: CommandButtonProps) {
  const isProcessing = processingCommand === command;
  const isOn = status === "LIGADO";

  return (
    <View style={styles.commandCard}>
      <View style={styles.commandHeader}>
        <View style={styles.commandTextBox}>
          <Text style={styles.commandTitle}>{title}</Text>
          <Text style={styles.commandDescription}>{description}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isOn ? colors.success : colors.muted,
            },
          ]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.commandButton,
          {
            backgroundColor: isOn ? colors.danger : colors.primary,
          },
        ]}
        onPress={() => onPress(command)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color={colors.textLight} />
        ) : (
          <Text style={styles.commandButtonText}>
            {isOn ? "Desligar" : "Ligar"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function DeviceControlScreen() {
  const {
    device,
    loading,
    processingCommand,
    error,
    feedback,
    reload,
    sendCommand,
  } = useIoTDevice();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dispositivo IoT...</Text>
      </View>
    );
  }

  if (error || !device) {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Controle IoT</Text>

      <Text style={styles.subtitle}>
        Comandos simulados para o ESP32 do biofotorreator.
      </Text>

      <View style={styles.deviceCard}>
        <Text style={styles.deviceName}>{device.nome}</Text>

        <Text style={styles.info}>Tanque: {device.tanque}</Text>
        <Text style={styles.info}>MAC: {device.macAddress}</Text>
        <Text style={styles.info}>Última comunicação: {device.ultimaComunicacao}</Text>

        <View
          style={[
            styles.deviceStatusBadge,
            {
              backgroundColor:
                device.status === "ONLINE" ? colors.success : colors.danger,
            },
          ]}
        >
          <Text style={styles.statusText}>{device.status}</Text>
        </View>
      </View>

      {feedback && (
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Atuadores</Text>

      <CommandButton
        title="Bomba de oxigênio"
        description="Simula a oxigenação da cultura de microalgas."
        status={device.bombaOxigenio}
        command="OXYGEN_PUMP"
        processingCommand={processingCommand}
        onPress={sendCommand}
      />

      <CommandButton
        title="Cooler"
        description="Simula controle de temperatura do tanque."
        status={device.cooler}
        command="COOLER"
        processingCommand={processingCommand}
        onPress={sendCommand}
      />

      <CommandButton
        title="Injetor de CO₂"
        description="Simula alimentação de carbono para crescimento celular."
        status={device.injetorCo2}
        command="CO2_INJECTOR"
        processingCommand={processingCommand}
        onPress={sendCommand}
      />

      <CommandButton
        title="Bomba de colheita"
        description="Simula a retirada da biomassa no pico de produção."
        status={device.bombaColheita}
        command="HARVEST_PUMP"
        processingCommand={processingCommand}
        onPress={sendCommand}
      />

      <TouchableOpacity style={styles.reloadButton} onPress={reload}>
        <Text style={styles.reloadButtonText}>Atualizar status</Text>
      </TouchableOpacity>
    </ScrollView>
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
  deviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  deviceName: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  info: {
    color: colors.muted,
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  deviceStatusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusText: {
    color: colors.textLight,
    fontSize: typography.small,
    fontWeight: "bold",
  },
  feedbackCard: {
    backgroundColor: colors.carbon,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  feedbackText: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  commandCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  commandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  commandTextBox: {
    flex: 1,
  },
  commandTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  commandDescription: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 20,
  },
  commandButton: {
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
  },
  commandButtonText: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
  reloadButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  reloadButtonText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "bold",
  },
});
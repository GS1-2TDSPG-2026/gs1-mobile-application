import { dotnetApiClient } from "../api/dotnetApiClient";
import {
  ActuatorStatus,
  IoTCommandResult,
  IoTCommandType,
  IoTDevice,
} from "../../domain/models/IoTDevice";

type ApiDispositivo = {
  idDispositivo?: number;
  IdDispositivo?: number;
  idTanque?: number;
  IdTanque?: number;
  codigoSerie?: string;
  CodigoSerie?: string;
  topicoMqtt?: string;
  TopicoMqtt?: string;
  modelo?: string | null;
  Modelo?: string | null;
  ativo?: string;
  Ativo?: string;
  dtInstalacao?: string;
  DtInstalacao?: string;
};

type ApiTanque = {
  idTanque?: number;
  IdTanque?: number;
  codigoTanque?: string;
  CodigoTanque?: string;
};

let actuatorState: Record<IoTCommandType, ActuatorStatus> = {
  OXYGEN_PUMP: "DESLIGADO",
  COOLER: "DESLIGADO",
  CO2_INJECTOR: "DESLIGADO",
  HARVEST_PUMP: "DESLIGADO",
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getDeviceId(item: ApiDispositivo): number {
  return toNumber(item.idDispositivo ?? item.IdDispositivo);
}

function getTankId(item: ApiDispositivo | ApiTanque): number {
  return toNumber(item.idTanque ?? item.IdTanque);
}

function formatRelativeDate(value?: string): string {
  if (!value) {
    return "sem registro";
  }

  const date = new Date(value);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return "sem registro";
  }

  const diffMs = Date.now() - time;

  if (diffMs < 0) {
    return "agora";
  }

  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "agora";
  }

  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `há ${diffDays}d`;
}

function toggleStatus(current: ActuatorStatus): ActuatorStatus {
  return current === "LIGADO" ? "DESLIGADO" : "LIGADO";
}

function getCommandLabel(command: IoTCommandType): string {
  if (command === "OXYGEN_PUMP") {
    return "Bomba de oxigênio";
  }

  if (command === "COOLER") {
    return "Cooler";
  }

  if (command === "CO2_INJECTOR") {
    return "Injetor de CO₂";
  }

  return "Bomba de colheita";
}

function mapDevice(item: ApiDispositivo, tanques: ApiTanque[]): IoTDevice {
  const tankId = getTankId(item);
  const tanque = tanques.find((current) => getTankId(current) === tankId);
  const ativo = String(item.ativo ?? item.Ativo ?? "")
    .toUpperCase()
    .trim();

  return {
    id: getDeviceId(item),
    nome: item.modelo ?? item.Modelo ?? "ESP32 Biofotorreator",
    macAddress: item.codigoSerie ?? item.CodigoSerie ?? "Sem código de série",
    status: ativo === "S" ? "ONLINE" : "OFFLINE",
    ultimaComunicacao: formatRelativeDate(item.dtInstalacao ?? item.DtInstalacao),
    tanque: tanque?.codigoTanque ?? tanque?.CodigoTanque ?? `Tanque ${tankId}`,
    bombaOxigenio: actuatorState.OXYGEN_PUMP,
    cooler: actuatorState.COOLER,
    injetorCo2: actuatorState.CO2_INJECTOR,
    bombaColheita: actuatorState.HARVEST_PUMP,
  };
}

export const IoTDeviceRepository = {
  async getDeviceStatus(): Promise<IoTDevice> {
    const [deviceResponse, tankResponse] = await Promise.all([
      dotnetApiClient.get<ApiDispositivo[]>("/DispositivoIot"),
      dotnetApiClient.get<ApiTanque[]>("/Tanque"),
    ]);

    const devices = Array.isArray(deviceResponse.data)
      ? deviceResponse.data
      : [];

    const tanks = Array.isArray(tankResponse.data) ? tankResponse.data : [];

    const activeDevice =
      devices.find(
        (device) =>
          String(device.ativo ?? device.Ativo ?? "")
            .toUpperCase()
            .trim() === "S"
      ) ?? devices[0];

    if (!activeDevice) {
      throw new Error("Nenhum dispositivo IoT encontrado na API .NET.");
    }

    return mapDevice(activeDevice, tanks);
  },

  async sendCommand(command: IoTCommandType): Promise<IoTCommandResult> {
    actuatorState = {
      ...actuatorState,
      [command]: toggleStatus(actuatorState[command]),
    };

    return {
      command,
      message: `${getCommandLabel(command)} ${actuatorState[
        command
      ].toLowerCase()}. Comando visual atualizado no app; endpoint MQTT de comando ainda precisa ser criado na .NET.`,
    };
  },
};
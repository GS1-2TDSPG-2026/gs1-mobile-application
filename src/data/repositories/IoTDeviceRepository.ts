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
  id?: number;
  Id?: number;

  idTanque?: number;
  IdTanque?: number;

  nome?: string;
  Nome?: string;
  nomeDispositivo?: string;
  NomeDispositivo?: string;
  modelo?: string;
  Modelo?: string;

  macAddress?: string;
  MacAddress?: string;
  mac?: string;
  Mac?: string;

  ativo?: string;
  Ativo?: string;

  dtUltimaComunicacao?: string;
  DtUltimaComunicacao?: string;
  ultimaComunicacao?: string;
  UltimaComunicacao?: string;
};

type ApiTanque = {
  idTanque?: number;
  IdTanque?: number;
  id?: number;
  Id?: number;
  codigoTanque?: string;
  CodigoTanque?: string;
};

let currentDevice: IoTDevice | null = null;
let currentDeviceId: number | null = null;

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getDeviceId(device: ApiDispositivo): number {
  return toNumber(
    device.idDispositivo ?? device.IdDispositivo ?? device.id ?? device.Id
  );
}

function getTankId(item: ApiDispositivo | ApiTanque): number {
  return toNumber(item.idTanque ?? item.IdTanque ?? item.id ?? item.Id);
}

function getTankCode(tank?: ApiTanque): string {
  if (!tank) {
    return "Tanque não identificado";
  }

  const tankId = getTankId(tank);

  return tank.codigoTanque ?? tank.CodigoTanque ?? `Tanque ${tankId}`;
}

function isActive(device: ApiDispositivo): boolean {
  const value = String(device.ativo ?? device.Ativo ?? "")
    .toUpperCase()
    .trim();

  return value === "S" || value === "SIM" || value === "TRUE" || value === "ATIVO";
}

function formatRelativeDate(value?: string): string {
  if (!value) {
    return "sem comunicação";
  }

  const date = new Date(value);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return value;
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

function mapDevice(device: ApiDispositivo, tanks: ApiTanque[]): IoTDevice {
  const tankId = getTankId(device);
  const tank = tanks.find((item) => getTankId(item) === tankId);
  const active = isActive(device);

  const mappedDevice: IoTDevice = {
    id: getDeviceId(device),
    nome:
      device.nome ??
      device.Nome ??
      device.nomeDispositivo ??
      device.NomeDispositivo ??
      device.modelo ??
      device.Modelo ??
      "ESP32-WROOM-32",
    macAddress:
      device.macAddress ??
      device.MacAddress ??
      device.mac ??
      device.Mac ??
      `ESP32-TANQUE-${tankId}`,
    status: active ? "ONLINE" : "OFFLINE",
    ultimaComunicacao: formatRelativeDate(
      device.dtUltimaComunicacao ??
        device.DtUltimaComunicacao ??
        device.ultimaComunicacao ??
        device.UltimaComunicacao
    ),
    tanque: getTankCode(tank),
    bombaOxigenio: currentDevice?.bombaOxigenio ?? "DESLIGADO",
    cooler: currentDevice?.cooler ?? "DESLIGADO",
    injetorCo2: currentDevice?.injetorCo2 ?? "DESLIGADO",
    bombaColheita: currentDevice?.bombaColheita ?? "DESLIGADO",
  };

  currentDevice = mappedDevice;
  currentDeviceId = mappedDevice.id;

  return mappedDevice;
}

function toggleStatus(status: ActuatorStatus): ActuatorStatus {
  return status === "LIGADO" ? "DESLIGADO" : "LIGADO";
}

function getCommandPayload(
  command: IoTCommandType,
  nextStatus: ActuatorStatus
): string {
  const shouldTurnOn = nextStatus === "LIGADO";

  if (command === "HARVEST_PUMP") {
    return shouldTurnOn ? "ABRIR_SERVO" : "FECHAR_SERVO";
  }

  if (command === "OXYGEN_PUMP") {
    return shouldTurnOn ? "LIGAR_BOMBA_OXIGENIO" : "DESLIGAR_BOMBA_OXIGENIO";
  }

  if (command === "COOLER") {
    return shouldTurnOn ? "LIGAR_COOLER" : "DESLIGAR_COOLER";
  }

  return shouldTurnOn ? "LIGAR_CO2" : "DESLIGAR_CO2";
}

function updateLocalDevice(command: IoTCommandType): IoTDevice {
  if (!currentDevice) {
    throw new Error("Nenhum dispositivo IoT carregado.");
  }

  if (command === "OXYGEN_PUMP") {
    currentDevice = {
      ...currentDevice,
      bombaOxigenio: toggleStatus(currentDevice.bombaOxigenio),
      ultimaComunicacao: "agora",
    };

    return currentDevice;
  }

  if (command === "COOLER") {
    currentDevice = {
      ...currentDevice,
      cooler: toggleStatus(currentDevice.cooler),
      ultimaComunicacao: "agora",
    };

    return currentDevice;
  }

  if (command === "CO2_INJECTOR") {
    currentDevice = {
      ...currentDevice,
      injetorCo2: toggleStatus(currentDevice.injetorCo2),
      ultimaComunicacao: "agora",
    };

    return currentDevice;
  }

  currentDevice = {
    ...currentDevice,
    bombaColheita: toggleStatus(currentDevice.bombaColheita),
    ultimaComunicacao: "agora",
  };

  return currentDevice;
}

function getCommandMessage(command: IoTCommandType, device: IoTDevice): string {
  if (command === "OXYGEN_PUMP") {
    return `Bomba de oxigênio ${device.bombaOxigenio.toLowerCase()} via MQTT.`;
  }

  if (command === "COOLER") {
    return `Cooler ${device.cooler.toLowerCase()} via MQTT.`;
  }

  if (command === "CO2_INJECTOR") {
    return `Injetor de CO₂ ${device.injetorCo2.toLowerCase()} via MQTT.`;
  }

  return `Bomba de colheita ${device.bombaColheita.toLowerCase()} via MQTT.`;
}

export const IoTDeviceRepository = {
  async getDeviceStatus(allowedTankIds: number[]): Promise<IoTDevice> {
    if (!allowedTankIds || allowedTankIds.length === 0) {
      throw new Error("Nenhum tanque vinculado ao usuário.");
    }

    const allowedTanks = new Set(allowedTankIds);

    const [devicesResponse, tanksResponse] = await Promise.all([
      dotnetApiClient.get<ApiDispositivo[]>("/DispositivoIot"),
      dotnetApiClient.get<ApiTanque[]>("/Tanque"),
    ]);

    const devices = Array.isArray(devicesResponse.data)
      ? devicesResponse.data
      : [];

    const tanks = Array.isArray(tanksResponse.data) ? tanksResponse.data : [];

    const visibleDevices = devices.filter((device) =>
      allowedTanks.has(getTankId(device))
    );

    const selectedDevice =
      visibleDevices.find(isActive) ?? visibleDevices[0];

    if (!selectedDevice) {
      throw new Error("Nenhum dispositivo IoT encontrado para seus tanques.");
    }

    return mapDevice(selectedDevice, tanks);
  },

  async sendCommand(command: IoTCommandType): Promise<IoTCommandResult> {
    if (!currentDevice || !currentDeviceId) {
      throw new Error("Nenhum dispositivo IoT carregado.");
    }

    const previewDevice = updateLocalDevice(command);

    const nextStatus =
      command === "OXYGEN_PUMP"
        ? previewDevice.bombaOxigenio
        : command === "COOLER"
        ? previewDevice.cooler
        : command === "CO2_INJECTOR"
        ? previewDevice.injetorCo2
        : previewDevice.bombaColheita;

    const mqttCommand = getCommandPayload(command, nextStatus);

    await dotnetApiClient.post("/iot/comandos", {
      idDispositivo: currentDeviceId,
      comando: mqttCommand,
    });

    return {
      command,
      message: getCommandMessage(command, previewDevice),
    };
  },
};
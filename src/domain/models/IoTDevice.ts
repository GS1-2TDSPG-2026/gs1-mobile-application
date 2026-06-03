export type DeviceStatus = "ONLINE" | "OFFLINE" | "MANUTENCAO";

export type ActuatorStatus = "LIGADO" | "DESLIGADO";

export type IoTCommandType =
  | "OXYGEN_PUMP"
  | "COOLER"
  | "CO2_INJECTOR"
  | "HARVEST_PUMP";

export type IoTDevice = {
  id: number;
  nome: string;
  macAddress: string;
  status: DeviceStatus;
  ultimaComunicacao: string;
  tanque: string;
  bombaOxigenio: ActuatorStatus;
  cooler: ActuatorStatus;
  injetorCo2: ActuatorStatus;
  bombaColheita: ActuatorStatus;
};

export type IoTCommandResult = {
  command: IoTCommandType;
  message: string;
};
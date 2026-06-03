import {
  ActuatorStatus,
  IoTCommandResult,
  IoTCommandType,
  IoTDevice,
} from "../../domain/models/IoTDevice";

let mockDevice: IoTDevice = {
  id: 1,
  nome: "ESP32 Biofotorreator 01",
  macAddress: "A4:C1:38:9F:22:B1",
  status: "ONLINE",
  ultimaComunicacao: "há 1 min",
  tanque: "Tanque A01",
  bombaOxigenio: "DESLIGADO",
  cooler: "DESLIGADO",
  injetorCo2: "DESLIGADO",
  bombaColheita: "DESLIGADO",
};

function toggleStatus(current: ActuatorStatus): ActuatorStatus {
  return current === "LIGADO" ? "DESLIGADO" : "LIGADO";
}

export const IoTDeviceRepository = {
  async getDeviceStatus(): Promise<IoTDevice> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return { ...mockDevice };
  },

  async sendCommand(command: IoTCommandType): Promise<IoTCommandResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (command === "OXYGEN_PUMP") {
      mockDevice = {
        ...mockDevice,
        bombaOxigenio: toggleStatus(mockDevice.bombaOxigenio),
        ultimaComunicacao: "agora",
      };

      return {
        command,
        message: `Bomba de oxigênio ${mockDevice.bombaOxigenio.toLowerCase()}.`,
      };
    }

    if (command === "COOLER") {
      mockDevice = {
        ...mockDevice,
        cooler: toggleStatus(mockDevice.cooler),
        ultimaComunicacao: "agora",
      };

      return {
        command,
        message: `Cooler ${mockDevice.cooler.toLowerCase()}.`,
      };
    }

    if (command === "CO2_INJECTOR") {
      mockDevice = {
        ...mockDevice,
        injetorCo2: toggleStatus(mockDevice.injetorCo2),
        ultimaComunicacao: "agora",
      };

      return {
        command,
        message: `Injetor de CO₂ ${mockDevice.injetorCo2.toLowerCase()}.`,
      };
    }

    mockDevice = {
      ...mockDevice,
      bombaColheita: toggleStatus(mockDevice.bombaColheita),
      ultimaComunicacao: "agora",
    };

    return {
      command,
      message: `Bomba de colheita ${mockDevice.bombaColheita.toLowerCase()}.`,
    };
  },
};
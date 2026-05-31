import { CriticalAlert } from "../../domain/models/CriticalAlert";

let mockAlerts: CriticalAlert[] = [
  {
    id: 1,
    tanque: "Tanque A01",
    tipo: "pH crítico",
    mensagem: "pH abaixo do limite seguro para Spirulina.",
    severidade: "CRITICO",
    status: "ABERTO",
    criadoEm: "há 2 min",
  },
  {
    id: 2,
    tanque: "Tanque B02",
    tipo: "Temperatura elevada",
    mensagem: "Temperatura acima do ideal para crescimento celular.",
    severidade: "ATENCAO",
    status: "ABERTO",
    criadoEm: "há 8 min",
  },
  {
    id: 3,
    tanque: "Tanque C03",
    tipo: "Turbidez elevada",
    mensagem: "Nível de turbidez indica possível contaminação no tanque.",
    severidade: "CRITICO",
    status: "RESOLVIDO",
    criadoEm: "há 20 min",
  },
];

export const CriticalAlertRepository = {
  async getAlerts(): Promise<CriticalAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return [...mockAlerts];
  },

  async resolveAlert(alertId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    mockAlerts = mockAlerts.map((alert) =>
      alert.id === alertId
        ? {
            ...alert,
            status: "RESOLVIDO",
          }
        : alert
    );
  },
};
export type CriticalAlertSeverity = "ATENCAO" | "CRITICO";

export type CriticalAlertStatus = "ABERTO" | "RESOLVIDO";

export type CriticalAlert = {
  id: number;
  tanque: string;
  tipo: string;
  mensagem: string;
  severidade: CriticalAlertSeverity;
  status: CriticalAlertStatus;
  criadoEm: string;
};
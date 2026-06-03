export type TankStatus = "NORMAL" | "ATENCAO" | "CRITICO";

export type TankMetric = {
  id: number;
  nomeTanque: string;
  ph: number;
  temperatura: number;
  turbidez: number;
  luminosidade: number;
  status: TankStatus;
  ultimaLeitura: string;
};

export type TelemetryDashboard = {
  fazendaNome: string;
  dispositivoStatus: "ONLINE" | "OFFLINE";
  previsaoBiomassa: string;
  confiancaIA: number;
  metricas: TankMetric[];
};
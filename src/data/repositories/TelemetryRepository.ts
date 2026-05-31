import { TelemetryDashboard } from "../../domain/models/Telemetry";

export const TelemetryRepository = {
  async getDashboard(fazendaId?: number): Promise<TelemetryDashboard> {
    console.log("Buscando dashboard da fazenda:", fazendaId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      fazendaNome: "Cooperativa Juazeiro",
      dispositivoStatus: "ONLINE",
      previsaoBiomassa: "Pico de biomassa previsto em 48h",
      confiancaIA: 87,
      metricas: [
        {
          id: 1,
          nomeTanque: "Tanque A01",
          ph: 7.2,
          temperatura: 26.5,
          turbidez: 12.4,
          luminosidade: 820,
          status: "NORMAL",
          ultimaLeitura: "há 2 min",
        },
        {
          id: 2,
          nomeTanque: "Tanque B02",
          ph: 6.4,
          temperatura: 29.1,
          turbidez: 18.7,
          luminosidade: 760,
          status: "ATENCAO",
          ultimaLeitura: "há 5 min",
        },
        {
          id: 3,
          nomeTanque: "Tanque C03",
          ph: 4.9,
          temperatura: 31.8,
          turbidez: 25.1,
          luminosidade: 690,
          status: "CRITICO",
          ultimaLeitura: "há 1 min",
        },
      ],
    };
  },
};
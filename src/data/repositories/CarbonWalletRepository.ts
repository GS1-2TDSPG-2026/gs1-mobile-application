import { CarbonWalletSummary } from "../../domain/models/CarbonCredit";

export const CarbonWalletRepository = {
  async getWalletSummary(carteiraId?: number): Promise<CarbonWalletSummary> {
    console.log("Buscando carteira de carbono:", carteiraId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      totalCo2: 38.4,
      creditosDisponiveis: 24,
      valorTotalEstimado: 42800,
      ultimaValidacao: "Hoje às 09:42",
      creditos: [
        {
          id: 1,
          codigo: "PHY-CO2-2026-001",
          quantidadeCo2: 12.8,
          valorEstimado: 14300,
          status: "VALIDADO",
          fazendaOrigem: "Cooperativa Juazeiro",
          dataValidacao: "27/05/2026",
          hashAuditoria: "0xA91F...7C22",
        },
        {
          id: 2,
          codigo: "PHY-CO2-2026-002",
          quantidadeCo2: 9.6,
          valorEstimado: 10800,
          status: "PENDENTE",
          fazendaOrigem: "Fazenda Solar Sertão",
          dataValidacao: "Aguardando validação",
          hashAuditoria: "Em processamento",
        },
        {
          id: 3,
          codigo: "PHY-CO2-2026-003",
          quantidadeCo2: 16,
          valorEstimado: 17700,
          status: "NEGOCIADO",
          fazendaOrigem: "Biofazenda Caatinga Azul",
          dataValidacao: "25/05/2026",
          hashAuditoria: "0xF82B...91AA",
        },
      ],
    };
  },
};
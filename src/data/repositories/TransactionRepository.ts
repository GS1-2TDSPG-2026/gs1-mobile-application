import { TransactionSummary } from "../../domain/models/Transaction";

export const TransactionRepository = {
  async getTransactions(carteiraId?: number): Promise<TransactionSummary> {
    console.log("Buscando histórico de transações:", carteiraId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      totalTransacionado: 76500,
      transacoesConcluidas: 3,
      transacoesPendentes: 1,
      transacoes: [
        {
          id: 1,
          codigo: "TX-PHY-2026-001",
          tipo: "COMPRA",
          ativo: "CREDITO_CARBONO",
          descricao: "Compra de crédito de carbono validado",
          quantidade: 12.8,
          unidade: "tCO₂e",
          valor: 14300,
          status: "CONCLUIDA",
          comprador: "Investidor ESG",
          vendedor: "Cooperativa Juazeiro",
          data: "27/05/2026",
          hashAuditoria: "0xA91F...7C22",
        },
        {
          id: 2,
          codigo: "TX-PHY-2026-002",
          tipo: "COMPRA",
          ativo: "BIOMASSA",
          descricao: "Aquisição de lote de Spirulina Premium",
          quantidade: 120,
          unidade: "kg",
          valor: 18500,
          status: "CONCLUIDA",
          comprador: "Comprador B2B",
          vendedor: "Cooperativa Juazeiro",
          data: "26/05/2026",
          hashAuditoria: "0xB82A...1F90",
        },
        {
          id: 3,
          codigo: "TX-PHY-2026-003",
          tipo: "VENDA",
          ativo: "CREDITO_CARBONO",
          descricao: "Venda de crédito de carbono bioativo",
          quantidade: 16,
          unidade: "tCO₂e",
          valor: 17700,
          status: "CONCLUIDA",
          comprador: "BioFoods Brasil",
          vendedor: "Biofazenda Caatinga Azul",
          data: "25/05/2026",
          hashAuditoria: "0xF82B...91AA",
        },
        {
          id: 4,
          codigo: "TX-PHY-2026-004",
          tipo: "COMPRA",
          ativo: "BIOMASSA",
          descricao: "Reserva de lote Chlorella Industrial",
          quantidade: 90,
          unidade: "kg",
          valor: 26000,
          status: "PENDENTE",
          comprador: "Comprador B2B",
          vendedor: "Fazenda Solar Sertão",
          data: "28/05/2026",
          hashAuditoria: "Aguardando confirmação",
        },
      ],
    };
  },
};
import {
  CreateMarketplaceLotRequest,
  MarketplaceLot,
  MarketplaceLotStatus,
} from "../../domain/models/MarketplaceLot";

let mockLots: MarketplaceLot[] = [
  {
    id: 1,
    nome: "Lote Spirulina Premium",
    tipo: "BIOMASSA",
    pesoKg: 120,
    preco: 18500,
    fazendaOrigem: "Cooperativa Juazeiro",
    status: "DISPONIVEL",
  },
  {
    id: 2,
    nome: "Crédito Carbono Bioativo",
    tipo: "CREDITO_CARBONO",
    pesoKg: 0,
    preco: 9200,
    fazendaOrigem: "Fazenda Solar Sertão",
    status: "RESERVADO",
  },
];

export const MarketplaceRepository = {
  async getLots(): Promise<MarketplaceLot[]> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return [...mockLots];
  },

  async createLot(data: CreateMarketplaceLotRequest): Promise<MarketplaceLot> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newLot: MarketplaceLot = {
      id: Date.now(),
      ...data,
      status: "DISPONIVEL",
    };

    mockLots = [newLot, ...mockLots];

    return newLot;
  },

  async updateLotStatus(
    lotId: number,
    status: MarketplaceLotStatus
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    mockLots = mockLots.map((lot) =>
      lot.id === lotId
        ? {
            ...lot,
            status,
          }
        : lot
    );
  },

  async deleteLot(lotId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    mockLots = mockLots.filter((lot) => lot.id !== lotId);
  },
};
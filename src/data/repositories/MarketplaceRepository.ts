import {
  CreateMarketplaceLotRequest,
  MarketplaceLot,
  MarketplaceLotStatus,
} from "../../domain/models/MarketplaceLot";
import { apiClient } from "../api/apiClient";

type ApiPage<T> = {
  content: T[];
};

type ApiLoteBiomassaResponse = {
  id: number;
  idFazenda: number;
  nomeFazenda: string;
  idTanque: number;
  codigoTanque: string;
  taxonomiaAlga: string;
  pesoKg: number;
  precoUnitario: number;
  status: MarketplaceLotStatus;
  dtColheita: string;
};

function toMarketplaceLot(apiLot: ApiLoteBiomassaResponse): MarketplaceLot {
  const valorTotal = Number(apiLot.pesoKg) * Number(apiLot.precoUnitario);

  return {
    id: apiLot.id,
    nome: `Lote ${apiLot.taxonomiaAlga}`,
    tipo: "BIOMASSA",
    pesoKg: Number(apiLot.pesoKg),
    preco: valorTotal,
    fazendaOrigem: apiLot.nomeFazenda,
    status: apiLot.status,

    idFazenda: apiLot.idFazenda,
    idTanque: apiLot.idTanque,
    codigoTanque: apiLot.codigoTanque,
    taxonomiaAlga: apiLot.taxonomiaAlga,
    precoUnitario: Number(apiLot.precoUnitario),
    dtColheita: apiLot.dtColheita,
  };
}

export const MarketplaceRepository = {
  async getLots(): Promise<MarketplaceLot[]> {
    const response = await apiClient.get<ApiPage<ApiLoteBiomassaResponse>>(
      "/marketplace/lotes",
      {
        params: {
          size: 50,
        },
      }
    );

    return response.data.content.map(toMarketplaceLot);
  },

  async createLot(data: CreateMarketplaceLotRequest): Promise<MarketplaceLot> {
    const response = await apiClient.post<ApiLoteBiomassaResponse>(
      "/marketplace/lotes",
      {
        idFazenda: 1,
        idTanque: 1,
        taxonomiaAlga: data.nome,
        pesoKg: data.pesoKg,
        precoUnitario: data.preco,
      }
    );

    return toMarketplaceLot(response.data);
  },

  async updateLotStatus(
    lotId: number,
    status: MarketplaceLotStatus
  ): Promise<void> {
    await apiClient.patch(`/marketplace/lotes/${lotId}/status`, {
      status,
    });
  },

  async deleteLot(lotId: number): Promise<void> {
    await apiClient.delete(`/marketplace/lotes/${lotId}`);
  },
};
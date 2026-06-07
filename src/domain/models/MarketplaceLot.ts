export type MarketplaceLotType = "BIOMASSA" | "CREDITO_CARBONO";

export type MarketplaceLotStatus =
  | "DISPONIVEL"
  | "RESERVADO"
  | "VENDIDO"
  | "CANCELADO";

export type MarketplaceLot = {
  id: number;
  nome: string;
  tipo: MarketplaceLotType;
  pesoKg: number;
  preco: number;
  fazendaOrigem: string;
  status: MarketplaceLotStatus;

  idFazenda?: number;
  idTanque?: number;
  codigoTanque?: string;
  taxonomiaAlga?: string;
  precoUnitario?: number;
  dtColheita?: string;
};

export type CreateMarketplaceLotRequest = {
  nome: string;
  tipo: MarketplaceLotType;
  pesoKg: number;
  preco: number;
  fazendaOrigem: string;
};
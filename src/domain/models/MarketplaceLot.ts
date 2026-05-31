export type MarketplaceLotType = "BIOMASSA" | "CREDITO_CARBONO";

export type MarketplaceLotStatus = "DISPONIVEL" | "RESERVADO" | "VENDIDO";

export type MarketplaceLot = {
  id: number;
  nome: string;
  tipo: MarketplaceLotType;
  pesoKg: number;
  preco: number;
  fazendaOrigem: string;
  status: MarketplaceLotStatus;
};

export type CreateMarketplaceLotRequest = {
  nome: string;
  tipo: MarketplaceLotType;
  pesoKg: number;
  preco: number;
  fazendaOrigem: string;
};
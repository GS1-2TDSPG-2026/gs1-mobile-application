export type CarbonCreditStatus =
  | "DISPONIVEL"
  | "VALIDADO"
  | "VENDIDO"
  | "PENDENTE"
  | "NEGOCIADO";

export type CarbonCredit = {
  id: number;
  codigo: string;
  idFazenda: number;
  idLote: number;
  quantidadeCo2: number;
  valorEstimado: number;
  status: CarbonCreditStatus;
  fazendaOrigem: string;
  dataValidacao: string;
  hashAuditoria: string;
};

export type CarbonWalletSummary = {
  totalCo2: number;
  creditosDisponiveis: number;
  valorTotalEstimado: number;
  ultimaValidacao: string;
  creditos: CarbonCredit[];
};
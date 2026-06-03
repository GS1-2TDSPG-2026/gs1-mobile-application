export type TransactionType = "COMPRA" | "VENDA";

export type TransactionAssetType = "BIOMASSA" | "CREDITO_CARBONO";

export type TransactionStatus = "PENDENTE" | "CONCLUIDA" | "CANCELADA";

export type Transaction = {
  id: number;
  codigo: string;
  tipo: TransactionType;
  ativo: TransactionAssetType;
  descricao: string;
  quantidade: number;
  unidade: string;
  valor: number;
  status: TransactionStatus;
  comprador: string;
  vendedor: string;
  data: string;
  hashAuditoria?: string;
};

export type TransactionSummary = {
  totalTransacionado: number;
  transacoesConcluidas: number;
  transacoesPendentes: number;
  transacoes: Transaction[];
};
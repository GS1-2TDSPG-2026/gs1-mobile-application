import {
  Transaction,
  TransactionAssetType,
  TransactionStatus,
  TransactionSummary,
  TransactionType,
} from "../../domain/models/Transaction";
import { apiClient } from "../api/apiClient";

type ApiTransacaoResponse = {
  id: number;
  idComprador: number;
  nomeComprador: string;
  idLote: number | null;
  idCredito: number | null;
  tipoTransacao: string;
  quantidade: number;
  valorTotal: number;
  status: string;
  dtTransacao: string;
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function buildTransactionCode(id: number) {
  return `TX-PHY-2026-${String(id).padStart(3, "0")}`;
}

function normalizeStatus(status: string): TransactionStatus {
  if (status === "CONFIRMADA" || status === "CONCLUIDA") {
    return "CONCLUIDA";
  }

  if (status === "CANCELADA") {
    return "CANCELADA";
  }

  return "PENDENTE";
}

function getTransactionType(tipoTransacao: string): TransactionType {
  if (tipoTransacao.includes("VENDA")) {
    return "VENDA";
  }

  return "COMPRA";
}

function getAssetType(apiTransaction: ApiTransacaoResponse): TransactionAssetType {
  if (apiTransaction.idCredito) {
    return "CREDITO_CARBONO";
  }

  return "BIOMASSA";
}

function getDescription(assetType: TransactionAssetType, tipo: TransactionType) {
  if (assetType === "CREDITO_CARBONO") {
    return tipo === "COMPRA"
      ? "Compra de crédito de carbono auditável"
      : "Venda de crédito de carbono auditável";
  }

  return tipo === "COMPRA"
    ? "Compra de lote de biomassa de microalgas"
    : "Venda de lote de biomassa de microalgas";
}

function getUnit(assetType: TransactionAssetType) {
  return assetType === "CREDITO_CARBONO" ? "tCO₂e" : "kg";
}

function toTransaction(apiTransaction: ApiTransacaoResponse): Transaction {
  const ativo = getAssetType(apiTransaction);
  const tipo = getTransactionType(apiTransaction.tipoTransacao);

  return {
    id: apiTransaction.id,
    codigo: buildTransactionCode(apiTransaction.id),
    tipo,
    ativo,
    descricao: getDescription(ativo, tipo),
    quantidade: Number(apiTransaction.quantidade),
    unidade: getUnit(ativo),
    valor: Number(apiTransaction.valorTotal),
    status: normalizeStatus(apiTransaction.status),
    comprador: apiTransaction.nomeComprador,
    vendedor:
      ativo === "CREDITO_CARBONO"
        ? "Fazenda emissora do crédito"
        : "Fazenda produtora de biomassa",
    data: formatDate(apiTransaction.dtTransacao),
    hashAuditoria:
      ativo === "CREDITO_CARBONO"
        ? `Crédito #${apiTransaction.idCredito}`
        : `Lote #${apiTransaction.idLote}`,
  };
}

function buildSummary(transacoes: Transaction[]): TransactionSummary {
  const totalTransacionado = transacoes.reduce(
    (total, transaction) => total + transaction.valor,
    0
  );

  const transacoesConcluidas = transacoes.filter(
    (transaction) => transaction.status === "CONCLUIDA"
  ).length;

  const transacoesPendentes = transacoes.filter(
    (transaction) => transaction.status === "PENDENTE"
  ).length;

  return {
    totalTransacionado,
    transacoesConcluidas,
    transacoesPendentes,
    transacoes,
  };
}

export const TransactionRepository = {
  async getTransactions(): Promise<TransactionSummary> {
    const response = await apiClient.get<ApiTransacaoResponse[]>(
      "/marketplace/transacoes/minhas"
    );

    const transacoes = response.data.map(toTransaction);

    return buildSummary(transacoes);
  },
};
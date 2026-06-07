import {
  CarbonCredit,
  CarbonCreditStatus,
  CarbonWalletSummary,
} from "../../domain/models/CarbonCredit";
import { apiClient } from "../api/apiClient";

type ApiPage<T> = {
  content: T[];
};

type ApiCreditoCarbonoResponse = {
  id: number;
  idFazenda: number;
  nomeFazenda: string;
  idLote: number;
  co2Toneladas: number;
  hashAuditoria: string;
  status: CarbonCreditStatus;
  dtValidacao: string | null;
};

const VALOR_ESTIMADO_POR_TONELADA = 1115;

function formatDate(date: string | null) {
  if (!date) {
    return "Aguardando validação";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function buildCreditCode(credit: ApiCreditoCarbonoResponse) {
  return `PHY-CO2-2026-${String(credit.id).padStart(3, "0")}`;
}

function toCarbonCredit(apiCredit: ApiCreditoCarbonoResponse): CarbonCredit {
  const quantidadeCo2 = Number(apiCredit.co2Toneladas);
  const valorEstimado = quantidadeCo2 * VALOR_ESTIMADO_POR_TONELADA;

  return {
    id: apiCredit.id,
    codigo: buildCreditCode(apiCredit),
    idFazenda: apiCredit.idFazenda,
    idLote: apiCredit.idLote,
    quantidadeCo2,
    valorEstimado,
    status: apiCredit.status,
    fazendaOrigem: apiCredit.nomeFazenda,
    dataValidacao: formatDate(apiCredit.dtValidacao),
    hashAuditoria: apiCredit.hashAuditoria || "Hash não gerado",
  };
}

function buildSummary(creditos: CarbonCredit[]): CarbonWalletSummary {
  const totalCo2 = creditos.reduce(
    (total, credito) => total + credito.quantidadeCo2,
    0
  );

  const valorTotalEstimado = creditos.reduce(
    (total, credito) => total + credito.valorEstimado,
    0
  );

  const creditosDisponiveis = creditos.filter(
    (credito) =>
      credito.status === "DISPONIVEL" || credito.status === "VALIDADO"
  ).length;

  const creditosValidados = creditos.filter(
    (credito) => credito.status === "VALIDADO"
  );

  const ultimaValidacao =
    creditosValidados.length > 0
      ? creditosValidados[creditosValidados.length - 1].dataValidacao
      : "Nenhuma validação";

  return {
    totalCo2,
    creditosDisponiveis,
    valorTotalEstimado,
    ultimaValidacao,
    creditos,
  };
}

export const CarbonWalletRepository = {
  async getWalletSummary(fazendaId?: number): Promise<CarbonWalletSummary> {
    const endpoint = fazendaId
      ? `/marketplace/creditos/fazenda/${fazendaId}`
      : "/marketplace/creditos";

    const response = await apiClient.get<
      ApiPage<ApiCreditoCarbonoResponse> | ApiCreditoCarbonoResponse[]
    >(endpoint, {
      params: fazendaId
        ? undefined
        : {
            size: 50,
          },
    });

    const payload = response.data;

    const apiCredits = Array.isArray(payload)
      ? payload
      : payload.content ?? [];

    const creditos = apiCredits.map(toCarbonCredit);

    return buildSummary(creditos);
  },

  async validateCredit(id: number): Promise<CarbonCredit> {
    const response = await apiClient.patch<ApiCreditoCarbonoResponse>(
      `/marketplace/creditos/${id}/validar`
    );

    return toCarbonCredit(response.data);
  },
};
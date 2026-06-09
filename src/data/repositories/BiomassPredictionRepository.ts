import {
  BiomassPredictionSummary,
  PredictionRiskLevel,
} from "../../domain/models/BiomassPrediction";
import { iaApiClient } from "../api/iaApiClient";

type IaPredictionRequest = {
  tanqueId: number;
  ph: number;
  temperatura: number;
  turbidez: number;
  luminosidade: number;
  radiacaoPar: number;
};

type IaPredictionResponse = {
  tanqueId: number;
  biomassaEstimada: number;
  dataPrevistaColheita: string;
  confianca: number;
  status: string;
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Indefinida";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function getRiskFromStatus(status: string): PredictionRiskLevel {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus.includes("CRITICO") ||
    normalizedStatus.includes("RUIM") ||
    normalizedStatus.includes("BAIXO")
  ) {
    return "ALTO";
  }

  if (
    normalizedStatus.includes("MODERADO") ||
    normalizedStatus.includes("ATENCAO") ||
    normalizedStatus.includes("MÉDIO") ||
    normalizedStatus.includes("MEDIO")
  ) {
    return "MEDIO";
  }

  return "BAIXO";
}

function getRecommendation(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus.includes("IDEAL") ||
    normalizedStatus.includes("BOM")
  ) {
    return "Manter parâmetros atuais. Crescimento dentro do esperado.";
  }

  if (
    normalizedStatus.includes("MODERADO") ||
    normalizedStatus.includes("ATENCAO") ||
    normalizedStatus.includes("MEDIO")
  ) {
    return "Monitorar pH, temperatura e radiação. Crescimento aceitável, mas exige acompanhamento.";
  }

  return "Corrigir os parâmetros do tanque antes da próxima janela de crescimento.";
}

export const BiomassPredictionRepository = {
  async getPredictions(fazendaId?: number): Promise<BiomassPredictionSummary> {
    console.log("Buscando previsões IA da fazenda:", fazendaId);

    const payload: IaPredictionRequest = {
      tanqueId: 10,
      ph: 7.2,
      temperatura: 26.5,
      turbidez: 38.0,
      luminosidade: 820,
      radiacaoPar: 5.7,
    };

    const response = await iaApiClient.post<IaPredictionResponse>(
      "/predict",
      payload
    );

    const prediction = response.data;

    const biomassaPrevista = Number(prediction.biomassaEstimada.toFixed(2));
    const biomassaAtual = Number((biomassaPrevista * 0.75).toFixed(2));

    const crescimentoPercentual = Number(
      (((biomassaPrevista - biomassaAtual) / biomassaAtual) * 100).toFixed(0)
    );

    return {
      fazendaNome: "Fazenda 5 - Tanque 10",
      modeloIA: "Random Forest Regressor",
      ultimaAtualizacao: "agora",
      previsoes: [
        {
          id: prediction.tanqueId,
          tanque: `Tanque ${prediction.tanqueId}`,
          biomassaAtual,
          biomassaPrevista48h: biomassaPrevista,
          crescimentoPercentual,
          confiancaModelo: Math.round(prediction.confianca),
          dataColheitaEstimada: formatDate(prediction.dataPrevistaColheita),
          radiacaoPAR: payload.radiacaoPar,
          indiceUV: Number((payload.radiacaoPar * 1.3).toFixed(1)),
          nebulosidade: 0,
          risco: getRiskFromStatus(prediction.status),
          recomendacao: getRecommendation(prediction.status),
        },
      ],
    };
  },
};
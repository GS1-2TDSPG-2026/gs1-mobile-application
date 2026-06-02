import { BiomassPredictionSummary } from "../../domain/models/BiomassPrediction";

export const BiomassPredictionRepository = {
  async getPredictions(fazendaId?: number): Promise<BiomassPredictionSummary> {
    console.log("Buscando previsões IA da fazenda:", fazendaId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      fazendaNome: "Cooperativa Juazeiro",
      modeloIA: "Random Forest Regressor",
      ultimaAtualizacao: "há 4 min",
      previsoes: [
        {
          id: 1,
          tanque: "Tanque A01",
          biomassaAtual: 1.8,
          biomassaPrevista48h: 2.6,
          crescimentoPercentual: 44,
          confiancaModelo: 91,
          dataColheitaEstimada: "30/05/2026 às 08:00",
          radiacaoPAR: 820,
          indiceUV: 7.4,
          nebulosidade: 18,
          risco: "BAIXO",
          recomendacao:
            "Manter parâmetros atuais. Tanque próximo do ponto ideal de colheita.",
        },
        {
          id: 2,
          tanque: "Tanque B02",
          biomassaAtual: 1.4,
          biomassaPrevista48h: 1.9,
          crescimentoPercentual: 35,
          confiancaModelo: 84,
          dataColheitaEstimada: "31/05/2026 às 10:30",
          radiacaoPAR: 760,
          indiceUV: 6.8,
          nebulosidade: 25,
          risco: "MEDIO",
          recomendacao:
            "Monitorar temperatura e pH. Crescimento está aceitável, mas exige atenção.",
        },
        {
          id: 3,
          tanque: "Tanque C03",
          biomassaAtual: 1.1,
          biomassaPrevista48h: 1.2,
          crescimentoPercentual: 9,
          confiancaModelo: 72,
          dataColheitaEstimada: "Indefinida",
          radiacaoPAR: 690,
          indiceUV: 5.9,
          nebulosidade: 42,
          risco: "ALTO",
          recomendacao:
            "Corrigir pH e temperatura antes da próxima janela de radiação solar.",
        },
      ],
    };
  },
};
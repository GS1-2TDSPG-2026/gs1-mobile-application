export type PredictionRiskLevel = "BAIXO" | "MEDIO" | "ALTO";

export type BiomassPrediction = {
  id: number;
  tanque: string;
  biomassaAtual: number;
  biomassaPrevista48h: number;
  crescimentoPercentual: number;
  confiancaModelo: number;
  dataColheitaEstimada: string;
  radiacaoPAR: number;
  indiceUV: number;
  nebulosidade: number;
  risco: PredictionRiskLevel;
  recomendacao: string;
};

export type BiomassPredictionSummary = {
  fazendaNome: string;
  modeloIA: string;
  ultimaAtualizacao: string;
  previsoes: BiomassPrediction[];
};
export type OrbitalRiskLevel = "BAIXO" | "MEDIO" | "ALTO";

export type OrbitalData = {
  id: number;
  fonte: string;
  localizacao: string;
  radiacaoPAR: number;
  indiceUV: number;
  nebulosidade: number;
  temperaturaExterna: number;
  previsaoClima: string;
  riscoOperacional: OrbitalRiskLevel;
  impactoNaBiomassa: string;
  atualizadoEm: string;
  dataColeta: string;
};

export type OrbitalDataSummary = {
  fazendaNome: string;
  latitude: number;
  longitude: number;
  dados: OrbitalData[];
};
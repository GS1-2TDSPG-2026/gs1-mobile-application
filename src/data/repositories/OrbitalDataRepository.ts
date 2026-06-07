import {
  OrbitalData,
  OrbitalDataSummary,
  OrbitalRiskLevel,
} from "../../domain/models/OrbitalData";
import { apiClient } from "../api/apiClient";

type ApiDadoOrbitalResponse = {
  id: number;
  idFazenda: number;
  nomeFazenda: string;
  fonte: string;
  dtColeta: string;
  irradianciaParTot: number | null;
  nebulosidade: number | null;
  temperaturaAmbiente: number | null;
  latitude: number | null;
  longitude: number | null;
  dtRegistro: string;
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function formatUpdatedAt(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "recentemente";
  }

  return formatDate(date);
}

function getRiskLevel(
  radiacaoPAR: number,
  nebulosidade: number,
  temperatura: number
): OrbitalRiskLevel {
  if (nebulosidade >= 70 || radiacaoPAR < 3 || temperatura >= 38) {
    return "ALTO";
  }

  if (nebulosidade >= 45 || radiacaoPAR < 4.5 || temperatura >= 34) {
    return "MEDIO";
  }

  return "BAIXO";
}

function getWeatherForecast(risco: OrbitalRiskLevel, nebulosidade: number) {
  if (risco === "ALTO") {
    return "Condição orbital desfavorável. Alta nebulosidade ou baixa incidência solar.";
  }

  if (risco === "MEDIO") {
    return "Condição moderada. Monitorar variação de radiação e temperatura.";
  }

  if (nebulosidade <= 25) {
    return "Alta incidência solar e baixa nebulosidade para o cultivo.";
  }

  return "Condição estável para acompanhamento do cultivo.";
}

function getBiomassImpact(risco: OrbitalRiskLevel) {
  if (risco === "ALTO") {
    return "Risco de redução na taxa fotossintética. Avaliar iluminação artificial ou ajuste operacional.";
  }

  if (risco === "MEDIO") {
    return "Possível oscilação no crescimento celular. Manter acompanhamento da biomassa.";
  }

  return "Condição favorável para fotossíntese e crescimento das microalgas.";
}

function estimateUvIndex(radiacaoPAR: number) {
  const estimated = radiacaoPAR * 1.4;

  if (estimated > 11) {
    return 11;
  }

  if (estimated < 0) {
    return 0;
  }

  return Number(estimated.toFixed(1));
}

function toOrbitalData(apiData: ApiDadoOrbitalResponse): OrbitalData {
  const radiacaoPAR = Number(apiData.irradianciaParTot ?? 0);
  const nebulosidade = Number(apiData.nebulosidade ?? 0);
  const temperatura = Number(apiData.temperaturaAmbiente ?? 0);

  const riscoOperacional = getRiskLevel(
    radiacaoPAR,
    nebulosidade,
    temperatura
  );

  return {
    id: apiData.id,
    fonte: apiData.fonte || "NASA_POWER",
    localizacao: apiData.nomeFazenda,
    radiacaoPAR,
    indiceUV: estimateUvIndex(radiacaoPAR),
    nebulosidade,
    temperaturaExterna: temperatura,
    previsaoClima: getWeatherForecast(riscoOperacional, nebulosidade),
    riscoOperacional,
    impactoNaBiomassa: getBiomassImpact(riscoOperacional),
    atualizadoEm: formatUpdatedAt(apiData.dtRegistro),
    dataColeta: formatDate(apiData.dtColeta),
  };
}

function buildSummary(apiData: ApiDadoOrbitalResponse[]): OrbitalDataSummary {
  const first = apiData[0];

  return {
    fazendaNome: first?.nomeFazenda ?? "Fazenda não identificada",
    latitude: Number(first?.latitude ?? 0),
    longitude: Number(first?.longitude ?? 0),
    dados: apiData.map(toOrbitalData),
  };
}

export const OrbitalDataRepository = {
  async getOrbitalData(fazendaId = 1): Promise<OrbitalDataSummary> {
    const response = await apiClient.get<ApiDadoOrbitalResponse[]>(
      `/dados-orbitais/fazenda/${fazendaId}`
    );

    return buildSummary(response.data);
  },

  async syncOrbitalData(fazendaId = 1): Promise<OrbitalDataSummary> {
    const response = await apiClient.post<ApiDadoOrbitalResponse[]>(
      `/dados-orbitais/fazenda/${fazendaId}/sincronizar`
    );

    return buildSummary(response.data);
  },
};
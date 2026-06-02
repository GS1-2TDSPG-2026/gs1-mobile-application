import { OrbitalDataSummary } from "../../domain/models/OrbitalData";

export const OrbitalDataRepository = {
  async getOrbitalData(fazendaId?: number): Promise<OrbitalDataSummary> {
    console.log("Buscando dados orbitais da fazenda:", fazendaId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      fazendaNome: "Cooperativa Juazeiro",
      latitude: -9.416,
      longitude: -40.503,
      dados: [
        {
          id: 1,
          fonte: "NASA POWER",
          localizacao: "Juazeiro - BA",
          radiacaoPAR: 820,
          indiceUV: 7.4,
          nebulosidade: 18,
          temperaturaExterna: 31.2,
          previsaoClima: "Alta incidência solar nas próximas 48h",
          riscoOperacional: "BAIXO",
          impactoNaBiomassa:
            "Condição favorável para fotossíntese e crescimento acelerado.",
          atualizadoEm: "há 5 min",
        },
        {
          id: 2,
          fonte: "Copernicus Climate Data",
          localizacao: "Juazeiro - BA",
          radiacaoPAR: 690,
          indiceUV: 5.9,
          nebulosidade: 42,
          temperaturaExterna: 28.7,
          previsaoClima: "Aumento de nebulosidade no período da tarde",
          riscoOperacional: "MEDIO",
          impactoNaBiomassa:
            "Possível redução da taxa fotossintética. Monitorar crescimento.",
          atualizadoEm: "há 12 min",
        },
        {
          id: 3,
          fonte: "NOAA Climate Feed",
          localizacao: "Juazeiro - BA",
          radiacaoPAR: 540,
          indiceUV: 4.8,
          nebulosidade: 67,
          temperaturaExterna: 26.4,
          previsaoClima: "Nebulosidade elevada e baixa radiação PAR",
          riscoOperacional: "ALTO",
          impactoNaBiomassa:
            "Risco de queda no crescimento celular. Ajustar iluminação artificial se disponível.",
          atualizadoEm: "há 20 min",
        },
      ],
    };
  },
};
import { Farm, FarmDashboard, Tank } from "../../domain/models/Farm";
import { apiClient } from "../api/apiClient";

type ApiPage<T> = {
  content: T[];
};

type ApiFarmResponse = {
  id: number;
  nome: string;
  cidade: string;
  uf: string;
  latitude: number;
  longitude: number;
  status: string;
  dtCadastro: string;
  idUsuarioResponsavel: number;
  nomeResponsavel: string;
};

type ApiTankResponse = {
  id: number;
  idFazenda: number;
  nomeFazenda: string;
  codigoTanque: string;
  tipoAlga: string;
  capacidadeLitros: number;
  phMin: number;
  phMax: number;
  temperaturaMin: number;
  temperaturaMax: number;
  status: string;
  dtInstalacao: string;
};

type ApiFarmDashboardResponse = {
  idFazenda: number;
  nomeFazenda: string;
  totalTanques: number;
  tanquesAtivos: number;
  lotesDisponiveis: number;
  creditosDisponiveis: number;
  totalCo2Toneladas: number;
  ultimoDadoOrbital: {
    id: number;
    fonte: string;
    dtColeta: string;
    irradianciaParTot: number;
    nebulosidade: number;
    temperaturaAmbiente: number;
  } | null;
};

function toFarm(apiFarm: ApiFarmResponse): Farm {
  return {
    id: apiFarm.id,
    nome: apiFarm.nome,
    cidade: apiFarm.cidade,
    uf: apiFarm.uf,
    latitude: Number(apiFarm.latitude ?? 0),
    longitude: Number(apiFarm.longitude ?? 0),
    status: apiFarm.status,
    dtCadastro: apiFarm.dtCadastro,
    idUsuarioResponsavel: apiFarm.idUsuarioResponsavel,
    nomeResponsavel: apiFarm.nomeResponsavel,
  };
}

function toTank(apiTank: ApiTankResponse): Tank {
  return {
    id: apiTank.id,
    idFazenda: apiTank.idFazenda,
    nomeFazenda: apiTank.nomeFazenda,
    codigoTanque: apiTank.codigoTanque,
    tipoAlga: apiTank.tipoAlga,
    capacidadeLitros: Number(apiTank.capacidadeLitros ?? 0),
    phMin: Number(apiTank.phMin ?? 0),
    phMax: Number(apiTank.phMax ?? 0),
    temperaturaMin: Number(apiTank.temperaturaMin ?? 0),
    temperaturaMax: Number(apiTank.temperaturaMax ?? 0),
    status: apiTank.status,
    dtInstalacao: apiTank.dtInstalacao,
  };
}

function toFarmDashboard(apiDashboard: ApiFarmDashboardResponse): FarmDashboard {
  return {
    idFazenda: apiDashboard.idFazenda,
    nomeFazenda: apiDashboard.nomeFazenda,
    totalTanques: apiDashboard.totalTanques,
    tanquesAtivos: apiDashboard.tanquesAtivos,
    lotesDisponiveis: apiDashboard.lotesDisponiveis,
    creditosDisponiveis: apiDashboard.creditosDisponiveis,
    totalCo2Toneladas: Number(apiDashboard.totalCo2Toneladas ?? 0),
    ultimoDadoOrbital: apiDashboard.ultimoDadoOrbital
      ? {
          id: apiDashboard.ultimoDadoOrbital.id,
          fonte: apiDashboard.ultimoDadoOrbital.fonte,
          dtColeta: apiDashboard.ultimoDadoOrbital.dtColeta,
          irradianciaParTot: Number(
            apiDashboard.ultimoDadoOrbital.irradianciaParTot ?? 0
          ),
          nebulosidade: Number(apiDashboard.ultimoDadoOrbital.nebulosidade ?? 0),
          temperaturaAmbiente: Number(
            apiDashboard.ultimoDadoOrbital.temperaturaAmbiente ?? 0
          ),
        }
      : null,
  };
}

export const FarmRepository = {
  async getMyFarms(): Promise<Farm[]> {
    const response = await apiClient.get<ApiFarmResponse[]>("/fazendas/minhas");

    if (response.data.length > 0) {
      return response.data.map(toFarm);
    }

    const fallbackResponse = await apiClient.get<ApiPage<ApiFarmResponse>>(
      "/fazendas",
      {
        params: {
          size: 50,
        },
      }
    );

    return fallbackResponse.data.content.map(toFarm);
  },

  async getFarmDashboard(farmId: number): Promise<FarmDashboard> {
    const response = await apiClient.get<ApiFarmDashboardResponse>(
      `/fazendas/${farmId}/dashboard`
    );

    return toFarmDashboard(response.data);
  },

  async getTanksByFarm(farmId: number): Promise<Tank[]> {
    const response = await apiClient.get<ApiTankResponse[]>(
      `/tanques/fazenda/${farmId}`
    );

    return response.data.map(toTank);
  },
};
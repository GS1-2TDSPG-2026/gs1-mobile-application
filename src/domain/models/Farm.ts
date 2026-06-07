export type FarmStatus = "ATIVA" | "INATIVA" | "MANUTENCAO" | string;

export type TankStatus = "ATIVO" | "INATIVO" | "MANUTENCAO" | string;

export type Farm = {
  id: number;
  nome: string;
  cidade: string;
  uf: string;
  latitude: number;
  longitude: number;
  status: FarmStatus;
  dtCadastro: string;
  idUsuarioResponsavel: number;
  nomeResponsavel: string;
};

export type CreateFarmRequest = {
  nome: string;
  cidade: string;
  uf: string;
  latitude: number;
  longitude: number;
};

export type UpdateFarmRequest = {
  nome?: string;
  cidade?: string;
  uf?: string;
  latitude?: number;
  longitude?: number;
  status?: FarmStatus;
};

export type Tank = {
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
  status: TankStatus;
  dtInstalacao: string;
};

export type CreateTankRequest = {
  idFazenda: number;
  codigoTanque: string;
  tipoAlga: string;
  capacidadeLitros: number;
  phMin: number;
  phMax: number;
  temperaturaMin: number;
  temperaturaMax: number;
  dtInstalacao: string;
};

export type UpdateTankRequest = {
  tipoAlga?: string;
  capacidadeLitros?: number;
  phMin?: number;
  phMax?: number;
  temperaturaMin?: number;
  temperaturaMax?: number;
  status?: TankStatus;
};

export type FarmDashboard = {
  idFazenda: number;
  nomeFazenda: string;
  totalTanques: number;
  tanquesAtivos: number;
  lotesDisponiveis: number;
  creditosDisponiveis: number;
  totalCo2Toneladas: number;
  ultimoDadoOrbital?: {
    id: number;
    fonte: string;
    dtColeta: string;
    irradianciaParTot: number;
    nebulosidade: number;
    temperaturaAmbiente: number;
  } | null;
};
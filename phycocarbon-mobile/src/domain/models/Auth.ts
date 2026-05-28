export type UserRole =
  | "OPERADOR_FAZENDA"
  | "INVESTIDOR_ESG"
  | "COMPRADOR_B2B";

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  perfil: UserRole;
  fazendaId?: number;
  carteiraId?: number;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type AuthSession = {
  token: string;
  usuario: AuthUser;
};
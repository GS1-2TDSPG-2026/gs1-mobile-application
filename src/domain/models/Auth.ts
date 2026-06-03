export type UserRole =
  | "OPERADOR_FAZENDA"
  | "INVESTIDOR_ESG"
  | "COMPRADOR_B2B";

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  perfil: UserRole;
  fotoUrl?: string;
  fazendaId?: number;
  carteiraId?: number;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
  perfil: UserRole;
};

export type AuthSession = {
  token: string;
  usuario: AuthUser;
};
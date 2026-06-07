import { UserRole } from "./Auth";

export type UserStatus = "ATIVO" | "INATIVO" | string;

export type UserProfile = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  status: UserStatus;
  criadoEm: string;
  idPerfil: number;
  perfil: UserRole;
  descricaoPerfil?: string;
};

export type UpdateUserProfileRequest = {
  nome: string;
  email: string;
  telefone?: string;
  status?: UserStatus;
};
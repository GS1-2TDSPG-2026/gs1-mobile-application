import {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from "../../domain/models/Auth";
import { apiClient } from "../api/apiClient";

type ApiTokenResponse = {
  token: string;
  tipo: string;
  id: number;
  nome: string;
  email: string;
  perfil: UserRole;
};

function toSession(data: ApiTokenResponse): AuthSession {
  const isOperator = data.perfil === "OPERADOR_CAMPO";

  return {
    token: data.token,
    usuario: {
      id: data.id,
      nome: data.nome,
      email: data.email,
      perfil: data.perfil,
      fazendaId: isOperator ? 1 : undefined,
      carteiraId: isOperator ? undefined : data.id,
    },
  };
}

async function login(data: LoginRequest): Promise<AuthSession> {
  const response = await apiClient.post<ApiTokenResponse>("/auth/login", data);

  return toSession(response.data);
}

async function register(data: RegisterRequest): Promise<AuthSession> {
  await apiClient.post("/auth/register", {
    nome: data.nome,
    email: data.email,
    senha: data.senha,
    telefone: data.telefone,
    nomePerfil: data.perfil,
  });

  return login({
    email: data.email,
    senha: data.senha,
  });
}

export const AuthRepository = {
  login,
  register,
};
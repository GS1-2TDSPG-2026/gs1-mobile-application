import {
  UpdateUserProfileRequest,
  UserProfile,
} from "../../domain/models/UserProfile";
import { UserRole } from "../../domain/models/Auth";
import { apiClient } from "../api/apiClient";

type ApiUsuarioResponse = {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string;
  status: string;
  dtCriacao: string;
  idPerfil: number;
  nomePerfil: UserRole;
  descricao?: string;
};

type ApiEntityModel<T> = T & {
  content?: T;
  _links?: unknown;
};

function unwrapEntity<T>(payload: ApiEntityModel<T>): T {
  return payload.content ?? payload;
}

function toUserProfile(apiUser: ApiUsuarioResponse): UserProfile {
  return {
    id: apiUser.idUsuario,
    nome: apiUser.nome,
    email: apiUser.email,
    telefone: apiUser.telefone,
    status: apiUser.status,
    criadoEm: apiUser.dtCriacao,
    idPerfil: apiUser.idPerfil,
    perfil: apiUser.nomePerfil,
    descricaoPerfil: apiUser.descricao,
  };
}

export const UserProfileRepository = {
  async getById(id: number): Promise<UserProfile> {
    const response = await apiClient.get<ApiEntityModel<ApiUsuarioResponse>>(
      `/usuarios/${id}`
    );

    return toUserProfile(unwrapEntity(response.data));
  },

  async update(
    id: number,
    data: UpdateUserProfileRequest
  ): Promise<UserProfile> {
    const response = await apiClient.put<ApiEntityModel<ApiUsuarioResponse>>(
      `/usuarios/${id}`,
      {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        status: data.status,
      }
    );

    return toUserProfile(unwrapEntity(response.data));
  },
};
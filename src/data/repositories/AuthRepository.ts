import {
  AuthSession,
  LoginRequest,
  RegisterRequest,
} from "../../domain/models/Auth";

let mockUsers: AuthSession[] = [
  {
    token: "mock-jwt-token-operador",
    usuario: {
      id: 1,
      nome: "Operador Campo",
      email: "operador@phycocarbon.com",
      perfil: "OPERADOR_FAZENDA",
      fotoUrl: "https://i.pravatar.cc/300?img=12",
      fazendaId: 101,
    },
  },
  {
    token: "mock-jwt-token-investidor",
    usuario: {
      id: 2,
      nome: "Investidor ESG",
      email: "investidor@phycocarbon.com",
      perfil: "INVESTIDOR_ESG",
      fotoUrl: "https://i.pravatar.cc/300?img=32",
      carteiraId: 201,
    },
  },
  {
    token: "mock-jwt-token-comprador",
    usuario: {
      id: 3,
      nome: "Comprador B2B",
      email: "comprador@phycocarbon.com",
      perfil: "COMPRADOR_B2B",
      fotoUrl: "https://i.pravatar.cc/300?img=47",
      carteiraId: 202,
    },
  },
];

export const AuthRepository = {
  async login(data: LoginRequest): Promise<AuthSession> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find(
      (item) =>
        item.usuario.email.toLowerCase() === data.email.toLowerCase() &&
        data.senha === "123456"
    );

    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }

    return user;
  },

  async register(data: RegisterRequest): Promise<AuthSession> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailAlreadyExists = mockUsers.some(
      (item) => item.usuario.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailAlreadyExists) {
      throw new Error("E-mail já cadastrado.");
    }

    const isOperator = data.perfil === "OPERADOR_FAZENDA";

    const newSession: AuthSession = {
      token: `mock-jwt-token-${Date.now()}`,
      usuario: {
        id: Date.now(),
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        fotoUrl: "https://i.pravatar.cc/300?img=5",
        fazendaId: isOperator ? 101 : undefined,
        carteiraId: isOperator ? undefined : 201,
      },
    };

    mockUsers = [newSession, ...mockUsers];

    return newSession;
  },
};
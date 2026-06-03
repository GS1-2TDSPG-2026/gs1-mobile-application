import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthSession,
  LoginRequest,
  RegisterRequest,
} from "../../domain/models/Auth";
import { AuthRepository } from "../../data/repositories/AuthRepository";
import { sessionStorage } from "../../data/storage/sessionStorage";

type AuthContextData = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileImage: (imageUri: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStoredSession() {
    try {
      const storedSession = await sessionStorage.get();
      setSession(storedSession);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(data: LoginRequest) {
    const loggedSession = await AuthRepository.login(data);

    await sessionStorage.save(loggedSession);
    setSession(loggedSession);
  }

  async function signUp(data: RegisterRequest) {
    const registeredSession = await AuthRepository.register(data);

    await sessionStorage.save(registeredSession);
    setSession(registeredSession);
  }

  async function signOut() {
    await sessionStorage.clear();
    setSession(null);
  }

  async function updateProfileImage(imageUri: string) {
    if (!session) {
      return;
    }

    const updatedSession: AuthSession = {
      ...session,
      usuario: {
        ...session.usuario,
        fotoUrl: imageUri,
      },
    };

    await sessionStorage.save(updatedSession);
    setSession(updatedSession);
  }

  useEffect(() => {
    loadStoredSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
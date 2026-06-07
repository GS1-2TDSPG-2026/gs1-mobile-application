import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../../presentation/contexts/AuthContext";
import { LoadingState } from "../../presentation/components/LoadingState";
import { AuthRoutes } from "./AuthRoutes";
import { InvestorRoutes } from "./InvestorRoutes";
import { OperatorRoutes } from "./OperatorRoutes";

export function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Restaurando sessão..." />;
  }

  function renderPrivateRoutes() {
    if (!session) {
      return <AuthRoutes />;
    }

    if (session.usuario.perfil === "OPERADOR_CAMPO") {
      return <OperatorRoutes />;
    }

    if (
      session.usuario.perfil === "INVESTIDOR" ||
      session.usuario.perfil === "COMPRADOR_B2B"
    ) {
      return <InvestorRoutes />;
    }

    if (session.usuario.perfil === "ADMIN") {
      return <OperatorRoutes />;
    }

    return <AuthRoutes />;
  }

  return <NavigationContainer>{renderPrivateRoutes()}</NavigationContainer>;
}
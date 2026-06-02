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

  return (
    <NavigationContainer>
      {!session ? (
        <AuthRoutes />
      ) : session.usuario.perfil === "OPERADOR_FAZENDA" ? (
        <OperatorRoutes />
      ) : (
        <InvestorRoutes />
      )}
    </NavigationContainer>
  );
}
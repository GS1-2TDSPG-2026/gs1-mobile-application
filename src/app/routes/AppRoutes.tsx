import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

import { colors } from "../../core/theme";
import { useAuth } from "../../presentation/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { InvestorRoutes } from "./InvestorRoutes";
import { OperatorRoutes } from "./OperatorRoutes";

export function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
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
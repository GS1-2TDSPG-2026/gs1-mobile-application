import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AlertasCriticosScreen } from "../../presentation/screens/operator/AlertasCriticosScreen";
import { DashboardOperacionalScreen } from "../../presentation/screens/operator/DashboardOperacionalScreen";
import { ProfileScreen } from "../../presentation/screens/ProfileScreen";
import { colors } from "../../core/theme";

const Tab = createBottomTabNavigator();

export function OperatorRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.carbon,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardOperacionalScreen}
        options={{
          title: "Operação",
        }}
      />

      <Tab.Screen
        name="Alertas"
        component={AlertasCriticosScreen}
        options={{
          title: "Alertas",
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}
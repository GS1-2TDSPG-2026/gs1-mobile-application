import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "../../core/theme";
import { AlertasCriticosScreen } from "../../presentation/screens/operator/AlertasCriticosScreen";
import { DashboardOperacionalScreen } from "../../presentation/screens/operator/DashboardOperacionalScreen";
import { DeviceControlScreen } from "../../presentation/screens/operator/DeviceControlScreen";
import { ProfileScreen } from "../../presentation/screens/ProfileScreen";
import { BiomassPredictionScreen } from "../../presentation/screens/operator/BiomassPredictionScreen";
import { OrbitalDataScreen } from "../../presentation/screens/operator/OrbitalDataScreen";

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
        name="IoT"
        component={DeviceControlScreen}
        options={{
          title: "IoT",
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
  name="IA"
  component={BiomassPredictionScreen}
  options={{
    title: "IA",
  }}
/>

<Tab.Screen
        name="Orbital"
        component={OrbitalDataScreen}
        options={{
          title: "Orbital",
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
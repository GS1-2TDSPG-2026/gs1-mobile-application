import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors } from "../../core/theme";
import { AlertasCriticosScreen } from "../../presentation/screens/operator/AlertasCriticosScreen";
import { DashboardOperacionalScreen } from "../../presentation/screens/operator/DashboardOperacionalScreen";
import { DeviceControlScreen } from "../../presentation/screens/operator/DeviceControlScreen";
import { ProfileScreen } from "../../presentation/screens/ProfileScreen";
import { BiomassPredictionScreen } from "../../presentation/screens/operator/BiomassPredictionScreen";
import { OrbitalDataScreen } from "../../presentation/screens/operator/OrbitalDataScreen";
import { FazendasTanquesScreen } from "../../presentation/screens/operator/FazendasTanquesScreen";

const Tab = createBottomTabNavigator();

export function OperatorRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: "rgba(142, 230, 209, 0.22)",
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          borderRightWidth: 0.5,
          borderRightColor: "rgba(142, 230, 209, 0.14)",
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

          if (route.name === "Dashboard") {
            iconName = focused ? "speedometer" : "speedometer-outline";
          }

          if (route.name === "Tanques") {
            iconName = focused ? "water" : "water-outline";
          }

          if (route.name === "IoT") {
            iconName = focused ? "hardware-chip" : "hardware-chip-outline";
          }

          if (route.name === "Alertas") {
            iconName = focused ? "warning" : "warning-outline";
          }

          if (route.name === "IA") {
            iconName = focused ? "analytics" : "analytics-outline";
          }

          if (route.name === "Orbital") {
            iconName = focused ? "planet" : "planet-outline";
          }

          if (route.name === "Perfil") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Ionicons name={iconName} size={26} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardOperacionalScreen} />

      <Tab.Screen name="Tanques" component={FazendasTanquesScreen} />

      <Tab.Screen name="IoT" component={DeviceControlScreen} />

      <Tab.Screen name="Alertas" component={AlertasCriticosScreen} />

      <Tab.Screen name="IA" component={BiomassPredictionScreen} />

      <Tab.Screen name="Orbital" component={OrbitalDataScreen} />

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBoxActive: {
    backgroundColor: "rgba(27, 188, 159, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(27, 188, 159, 0.35)",
  },
});
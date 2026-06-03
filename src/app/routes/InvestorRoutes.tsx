import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "../../core/theme";
import { CarteiraCarbonoScreen } from "../../presentation/screens/investor/CarteiraCarbonoScreen";
import { MarketplaceScreen } from "../../presentation/screens/investor/MarketplaceScreen";
import { ProfileScreen } from "../../presentation/screens/ProfileScreen";
import { TransactionHistoryScreen } from "../../presentation/screens/investor/TransactionHistoryScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export function InvestorRoutes() {
  return (
<Tab.Navigator
  screenOptions={({ route }) => ({
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
    tabBarIcon: ({ color, size }) => {
      let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

      if (route.name === "Marketplace") {
        iconName = "storefront-outline";
      }

      if (route.name === "Transacoes") {
        iconName = "receipt-outline";
      }

      if (route.name === "Carteira") {
        iconName = "leaf-outline";
      }

      if (route.name === "Perfil") {
        iconName = "person-circle-outline";
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
>
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          title: "Marketplace",
        }}
      />

      <Tab.Screen
        name="Transacoes"
        component={TransactionHistoryScreen}
        options={{
          title: "Transações",
        }}
      />

      <Tab.Screen
        name="Carteira"
        component={CarteiraCarbonoScreen}
        options={{
          title: "Carbono",
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
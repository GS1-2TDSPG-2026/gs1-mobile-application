import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { colors } from "../../core/theme";
import { CarteiraCarbonoScreen } from "../../presentation/screens/investor/CarteiraCarbonoScreen";
import { MarketplaceScreen } from "../../presentation/screens/investor/MarketplaceScreen";
import { ProfileScreen } from "../../presentation/screens/ProfileScreen";
import { TransactionHistoryScreen } from "../../presentation/screens/investor/TransactionHistoryScreen";

const Tab = createBottomTabNavigator();

export function InvestorRoutes() {
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
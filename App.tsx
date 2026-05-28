import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./src/presentation/contexts/AuthContext";
import { LoginScreen } from "./src/presentation/screens/auth/LoginScreen";
import { HomeMockScreen } from "./src/presentation/screens/HomeMockScreen";
import { colors } from "./src/core/theme";

function AppContent() {
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

  return session ? <HomeMockScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppContent />
    </AuthProvider>
  );
}
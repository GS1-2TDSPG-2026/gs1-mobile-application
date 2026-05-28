import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "./src/presentation/contexts/AuthContext";
import { LoginScreen } from "./src/presentation/screens/auth/LoginScreen";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <LoginScreen />
    </AuthProvider>
  );
}
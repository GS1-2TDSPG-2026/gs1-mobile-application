import { StatusBar } from "expo-status-bar";

import { AppRoutes } from "./src/app/routes/AppRoutes";
import { AuthProvider } from "./src/presentation/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppRoutes />
    </AuthProvider>
  );
}
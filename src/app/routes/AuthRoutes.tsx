import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../../presentation/screens/auth/LoginScreen";

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
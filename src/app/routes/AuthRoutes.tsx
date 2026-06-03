import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../../presentation/screens/auth/LoginScreen";
import { RegisterScreen } from "../../presentation/screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
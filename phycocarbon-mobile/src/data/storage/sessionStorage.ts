import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthSession } from "../../domain/models/Auth";

const SESSION_KEY = "@phycocarbon:session";

export const sessionStorage = {
  async save(session: AuthSession): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async get(): Promise<AuthSession | null> {
    const data = await AsyncStorage.getItem(SESSION_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as AuthSession;
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};
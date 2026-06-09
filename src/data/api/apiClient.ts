import axios from "axios";

import { sessionStorage } from "../storage/sessionStorage";

export const apiClient = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await sessionStorage.get();

  if (session?.token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${session.token}`;
  }

  return config;
});
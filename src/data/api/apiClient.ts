import axios from "axios";

import { sessionStorage } from "../storage/sessionStorage";

const API_BASE_URL = "https://gs1-java-devops.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await sessionStorage.get();

  if (session?.token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${session.token}`;
  }

  return config;
});
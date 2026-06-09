import axios from "axios";

export const DOTNET_API_BASE_URL = "https://gs1-net.onrender.com/api";

export const dotnetApiClient = axios.create({
  baseURL: DOTNET_API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
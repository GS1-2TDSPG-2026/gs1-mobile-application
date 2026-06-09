import axios from "axios";

const IA_API_BASE_URL = "http://163.176.225.114:8000/api/v1";

export const iaApiClient = axios.create({
  baseURL: IA_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
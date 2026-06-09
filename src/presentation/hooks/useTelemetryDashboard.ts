import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { FarmRepository } from "../../data/repositories/FarmRepository";
import { TelemetryRepository } from "../../data/repositories/TelemetryRepository";
import { TelemetryDashboard } from "../../domain/models/Telemetry";

export function useTelemetryDashboard() {
  const [dashboard, setDashboard] = useState<TelemetryDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const farms = await FarmRepository.getMyFarms();

      if (farms.length === 0) {
        setDashboard(null);
        setError(
          "Você ainda não possui fazendas cadastradas. Cadastre uma fazenda para visualizar o dashboard operacional."
        );
        return;
      }

      const primeiraFazenda = farms[0];

      const data = await TelemetryRepository.getDashboard(primeiraFazenda.id);

      setDashboard(data);
    } catch {
      setError("Não foi possível carregar o dashboard operacional.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard(true);
    }, [loadDashboard])
  );

  return {
    dashboard,
    loading,
    error,
    reload: () => loadDashboard(true),
  };
}
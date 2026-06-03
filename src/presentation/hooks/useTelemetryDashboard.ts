import { useCallback, useEffect, useState } from "react";

import { TelemetryRepository } from "../../data/repositories/TelemetryRepository";
import { TelemetryDashboard } from "../../domain/models/Telemetry";
import { useAuth } from "../contexts/AuthContext";

export function useTelemetryDashboard() {
  const { session } = useAuth();

  const [dashboard, setDashboard] = useState<TelemetryDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await TelemetryRepository.getDashboard(
        session?.usuario.fazendaId
      );

      setDashboard(data);
    } catch {
      setError("Não foi possível carregar o dashboard operacional.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.fazendaId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    reload: loadDashboard,
  };
}
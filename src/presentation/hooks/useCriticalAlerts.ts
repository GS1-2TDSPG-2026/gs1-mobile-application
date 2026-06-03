import { useCallback, useEffect, useMemo, useState } from "react";

import { CriticalAlertRepository } from "../../data/repositories/CriticalAlertRepository";
import { CriticalAlert } from "../../domain/models/CriticalAlert";

type AlertFilter = "TODOS" | "ABERTOS" | "RESOLVIDOS";

export function useCriticalAlerts() {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [filter, setFilter] = useState<AlertFilter>("ABERTOS");
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await CriticalAlertRepository.getAlerts();

      setAlerts(data);
    } catch {
      setError("Não foi possível carregar os alertas críticos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveAlert = useCallback(async (alertId: number) => {
    try {
      setResolvingId(alertId);

      await CriticalAlertRepository.resolveAlert(alertId);
      await loadAlerts();
    } catch {
      setError("Não foi possível marcar o alerta como resolvido.");
    } finally {
      setResolvingId(null);
    }
  }, [loadAlerts]);

  const filteredAlerts = useMemo(() => {
    if (filter === "ABERTOS") {
      return alerts.filter((alert) => alert.status === "ABERTO");
    }

    if (filter === "RESOLVIDOS") {
      return alerts.filter((alert) => alert.status === "RESOLVIDO");
    }

    return alerts;
  }, [alerts, filter]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return {
    alerts: filteredAlerts,
    filter,
    loading,
    resolvingId,
    error,
    setFilter,
    reload: loadAlerts,
    resolveAlert,
  };
}
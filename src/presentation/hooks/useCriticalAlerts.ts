import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { CriticalAlertRepository } from "../../data/repositories/CriticalAlertRepository";
import { FarmRepository } from "../../data/repositories/FarmRepository";
import { CriticalAlert } from "../../domain/models/CriticalAlert";

type AlertFilter = "TODOS" | "ABERTOS" | "RESOLVIDOS";

export function useCriticalAlerts() {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [filter, setFilter] = useState<AlertFilter>("ABERTOS");
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const isRefreshingRef = useRef(false);

  const loadAlerts = useCallback(async (showLoading = false) => {
    if (isRefreshingRef.current) {
      return;
    }

    try {
      isRefreshingRef.current = true;

      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const farms = await FarmRepository.getMyFarms();

      if (farms.length === 0) {
        setAlerts([]);
        return;
      }

      const tanksByFarm = await Promise.all(
        farms.map(async (farm) => {
          try {
            return await FarmRepository.getTanksByFarm(farm.id);
          } catch {
            return [];
          }
        })
      );

      const tankIds = tanksByFarm
        .flat()
        .map((tank) => tank.id)
        .filter((id) => Number.isFinite(id));

      if (tankIds.length === 0) {
        setAlerts([]);
        return;
      }

      const data = await CriticalAlertRepository.getAlerts(tankIds);

      setAlerts(data);
    } catch {
      setError("Não foi possível carregar os alertas críticos.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }

      isRefreshingRef.current = false;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAlerts(true);
    }, [loadAlerts])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      loadAlerts(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadAlerts]);

  const resolveAlert = useCallback(
    async (alertId: number) => {
      try {
        setResolvingId(alertId);
        setError("");

        await CriticalAlertRepository.resolveAlert(alertId);
        await loadAlerts(false);
      } catch {
        setError("Não foi possível marcar o alerta como resolvido.");
      } finally {
        setResolvingId(null);
      }
    },
    [loadAlerts]
  );

  const filteredAlerts = useMemo(() => {
    if (filter === "ABERTOS") {
      return alerts.filter((alert) => alert.status === "ABERTO");
    }

    if (filter === "RESOLVIDOS") {
      return alerts.filter((alert) => alert.status === "RESOLVIDO");
    }

    return alerts;
  }, [alerts, filter]);

  return {
    alerts: filteredAlerts,
    filter,
    loading,
    resolvingId,
    error,
    setFilter,
    reload: () => loadAlerts(true),
    resolveAlert,
  };
}
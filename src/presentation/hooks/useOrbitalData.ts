import { useCallback, useEffect, useState } from "react";

import { OrbitalDataRepository } from "../../data/repositories/OrbitalDataRepository";
import { OrbitalDataSummary } from "../../domain/models/OrbitalData";
import { useAuth } from "../contexts/AuthContext";

export function useOrbitalData() {
  const { session } = useAuth();

  const [summary, setSummary] = useState<OrbitalDataSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const fazendaId = session?.usuario.fazendaId ?? 1;

  const loadOrbitalData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await OrbitalDataRepository.getOrbitalData(fazendaId);

      setSummary(data);
    } catch {
      setError("Não foi possível carregar os dados orbitais.");
    } finally {
      setLoading(false);
    }
  }, [fazendaId]);

  async function syncOrbitalData() {
    try {
      setSyncing(true);
      setError("");

      const data = await OrbitalDataRepository.syncOrbitalData(fazendaId);

      setSummary(data);
    } catch {
      setError(
        "Não foi possível sincronizar com a NASA. Verifique a API Java e a conexão."
      );
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadOrbitalData();
  }, [loadOrbitalData]);

  return {
    summary,
    loading,
    syncing,
    error,
    reload: loadOrbitalData,
    syncOrbitalData,
  };
}
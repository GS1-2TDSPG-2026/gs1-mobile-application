import { useCallback, useEffect, useState } from "react";

import { OrbitalDataRepository } from "../../data/repositories/OrbitalDataRepository";
import { OrbitalDataSummary } from "../../domain/models/OrbitalData";
import { useAuth } from "../contexts/AuthContext";

export function useOrbitalData() {
  const { session } = useAuth();

  const [summary, setSummary] = useState<OrbitalDataSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrbitalData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await OrbitalDataRepository.getOrbitalData(
        session?.usuario.fazendaId
      );

      setSummary(data);
    } catch {
      setError("Não foi possível carregar os dados orbitais.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.fazendaId]);

  useEffect(() => {
    loadOrbitalData();
  }, [loadOrbitalData]);

  return {
    summary,
    loading,
    error,
    reload: loadOrbitalData,
  };
}
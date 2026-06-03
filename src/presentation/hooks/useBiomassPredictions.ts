import { useCallback, useEffect, useState } from "react";

import { BiomassPredictionRepository } from "../../data/repositories/BiomassPredictionRepository";
import { BiomassPredictionSummary } from "../../domain/models/BiomassPrediction";
import { useAuth } from "../contexts/AuthContext";

export function useBiomassPredictions() {
  const { session } = useAuth();

  const [summary, setSummary] = useState<BiomassPredictionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await BiomassPredictionRepository.getPredictions(
        session?.usuario.fazendaId
      );

      setSummary(data);
    } catch {
      setError("Não foi possível carregar as previsões de IA.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.fazendaId]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  return {
    summary,
    loading,
    error,
    reload: loadPredictions,
  };
}
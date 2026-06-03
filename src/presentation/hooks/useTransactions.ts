import { useCallback, useEffect, useState } from "react";

import { TransactionRepository } from "../../data/repositories/TransactionRepository";
import { TransactionSummary } from "../../domain/models/Transaction";
import { useAuth } from "../contexts/AuthContext";

export function useTransactions() {
  const { session } = useAuth();

  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await TransactionRepository.getTransactions(
        session?.usuario.carteiraId
      );

      setSummary(data);
    } catch {
      setError("Não foi possível carregar o histórico de transações.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.carteiraId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    summary,
    loading,
    error,
    reload: loadTransactions,
  };
}
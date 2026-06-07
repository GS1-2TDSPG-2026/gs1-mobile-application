import { useCallback, useEffect, useState } from "react";

import { CarbonWalletRepository } from "../../data/repositories/CarbonWalletRepository";
import { CarbonWalletSummary } from "../../domain/models/CarbonCredit";
import { useAuth } from "../contexts/AuthContext";

export function useCarbonWallet() {
  const { session } = useAuth();

  const [wallet, setWallet] = useState<CarbonWalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await CarbonWalletRepository.getWalletSummary(
        session?.usuario.fazendaId
      );

      setWallet(data);
    } catch {
      setError("Não foi possível carregar a carteira de carbono.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.fazendaId]);

  async function validateCredit(id: number) {
    try {
      setValidatingId(id);
      setError("");

      await CarbonWalletRepository.validateCredit(id);
      await loadWallet();
    } catch {
      setError("Não foi possível validar o crédito de carbono.");
    } finally {
      setValidatingId(null);
    }
  }

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  return {
    wallet,
    loading,
    validatingId,
    error,
    reload: loadWallet,
    validateCredit,
  };
}
import { useCallback, useEffect, useState } from "react";

import { CarbonWalletRepository } from "../../data/repositories/CarbonWalletRepository";
import { CarbonWalletSummary } from "../../domain/models/CarbonCredit";
import { useAuth } from "../contexts/AuthContext";

export function useCarbonWallet() {
  const { session } = useAuth();

  const [wallet, setWallet] = useState<CarbonWalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await CarbonWalletRepository.getWalletSummary(
        session?.usuario.carteiraId
      );

      setWallet(data);
    } catch {
      setError("Não foi possível carregar a carteira de carbono.");
    } finally {
      setLoading(false);
    }
  }, [session?.usuario.carteiraId]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  return {
    wallet,
    loading,
    error,
    reload: loadWallet,
  };
}

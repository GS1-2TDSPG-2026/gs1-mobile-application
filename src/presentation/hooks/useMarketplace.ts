import { useCallback, useEffect, useState } from "react";

import { MarketplaceRepository } from "../../data/repositories/MarketplaceRepository";
import {
  CreateMarketplaceLotRequest,
  MarketplaceLot,
  MarketplaceLotStatus,
} from "../../domain/models/MarketplaceLot";

export function useMarketplace() {
  const [lots, setLots] = useState<MarketplaceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadLots = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await MarketplaceRepository.getLots();

      setLots(data);
    } catch {
      setError("Não foi possível carregar o marketplace.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createLot = useCallback(
    async (data: CreateMarketplaceLotRequest) => {
      try {
        setSubmitting(true);
        setError("");

        await MarketplaceRepository.createLot(data);
        await loadLots();
      } catch {
        setError("Não foi possível cadastrar o lote.");
      } finally {
        setSubmitting(false);
      }
    },
    [loadLots]
  );

  const updateStatus = useCallback(
    async (lotId: number, status: MarketplaceLotStatus) => {
      try {
        setProcessingId(lotId);
        setError("");

        await MarketplaceRepository.updateLotStatus(lotId, status);
        await loadLots();
      } catch {
        setError("Não foi possível atualizar o lote.");
      } finally {
        setProcessingId(null);
      }
    },
    [loadLots]
  );

  const deleteLot = useCallback(
    async (lotId: number) => {
      try {
        setProcessingId(lotId);
        setError("");

        await MarketplaceRepository.deleteLot(lotId);
        await loadLots();
      } catch {
        setError("Não foi possível remover o lote.");
      } finally {
        setProcessingId(null);
      }
    },
    [loadLots]
  );

    const buyLot = useCallback(
  async (lot: MarketplaceLot) => {
    try {
      setProcessingId(lot.id);
      setError("");

      await MarketplaceRepository.buyBiomassLot(lot);
      await loadLots();
    } catch {
      setError("Não foi possível comprar o lote.");
      throw new Error("Erro ao comprar lote");
    } finally {
      setProcessingId(null);
    }
  },
  [loadLots]
);

  useEffect(() => {
    loadLots();
  }, [loadLots]);

return {
  lots,
  loading,
  submitting,
  processingId,
  error,
  reload: loadLots,
  createLot,
  updateStatus,
  deleteLot,
  buyLot,
};
}
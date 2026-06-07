import { useCallback, useEffect, useState } from "react";

import { FarmRepository } from "../../data/repositories/FarmRepository";
import { Farm, FarmDashboard, Tank } from "../../domain/models/Farm";

export function useFarmsAndTanks() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<FarmDashboard | null>(null);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  const loadDetails = useCallback(async (farmId: number) => {
    try {
      setLoadingDetails(true);
      setError("");

      const [dashboardData, tanksData] = await Promise.all([
        FarmRepository.getFarmDashboard(farmId),
        FarmRepository.getTanksByFarm(farmId),
      ]);

      setDashboard(dashboardData);
      setTanks(tanksData);
    } catch {
      setError("Não foi possível carregar os dados da fazenda.");
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const farmData = await FarmRepository.getMyFarms();

      setFarms(farmData);

      const firstFarmId = farmData[0]?.id ?? null;
      setSelectedFarmId(firstFarmId);

      if (firstFarmId) {
        await loadDetails(firstFarmId);
      }
    } catch {
      setError("Não foi possível carregar fazendas e tanques.");
    } finally {
      setLoading(false);
    }
  }, [loadDetails]);

  async function selectFarm(farmId: number) {
    setSelectedFarmId(farmId);
    await loadDetails(farmId);
  }

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  return {
    farms,
    selectedFarmId,
    selectedFarm: farms.find((farm) => farm.id === selectedFarmId) ?? null,
    dashboard,
    tanks,
    loading,
    loadingDetails,
    error,
    reload: loadFarms,
    selectFarm,
  };
}
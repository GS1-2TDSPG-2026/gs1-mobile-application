import { useCallback, useEffect, useState } from "react";

import { FarmRepository } from "../../data/repositories/FarmRepository";
import {
  CreateFarmRequest,
  CreateTankRequest,
  Farm,
  FarmDashboard,
  Tank,
  UpdateFarmRequest,
  UpdateTankRequest,
} from "../../domain/models/Farm";

export function useFarmsAndTanks() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<FarmDashboard | null>(null);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
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

      const nextSelectedFarmId =
        selectedFarmId && farmData.some((farm) => farm.id === selectedFarmId)
          ? selectedFarmId
          : farmData[0]?.id ?? null;

      setSelectedFarmId(nextSelectedFarmId);

      if (nextSelectedFarmId) {
        await loadDetails(nextSelectedFarmId);
      } else {
        setDashboard(null);
        setTanks([]);
      }
    } catch {
      setError("Não foi possível carregar fazendas e tanques.");
    } finally {
      setLoading(false);
    }
  }, [loadDetails, selectedFarmId]);

  async function selectFarm(farmId: number) {
    setSelectedFarmId(farmId);
    await loadDetails(farmId);
  }

  async function createFarm(data: CreateFarmRequest) {
    try {
      setSubmitting(true);
      setError("");

      const createdFarm = await FarmRepository.createFarm(data);

      setSelectedFarmId(createdFarm.id);
      await loadFarms();
      await loadDetails(createdFarm.id);
    } catch {
      setError("Não foi possível cadastrar a fazenda.");
      throw new Error("Erro ao cadastrar fazenda");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateFarm(id: number, data: UpdateFarmRequest) {
    try {
      setSubmitting(true);
      setError("");

      await FarmRepository.updateFarm(id, data);
      await loadFarms();
      await loadDetails(id);
    } catch {
      setError("Não foi possível atualizar a fazenda.");
      throw new Error("Erro ao atualizar fazenda");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteFarm(id: number) {
    try {
      setProcessingId(id);
      setError("");

      await FarmRepository.deleteFarm(id);

      setSelectedFarmId(null);
      await loadFarms();
    } catch {
      setError(
        "Não foi possível excluir a fazenda. Ela pode possuir tanques, lotes ou créditos vinculados."
      );
      throw new Error("Erro ao excluir fazenda");
    } finally {
      setProcessingId(null);
    }
  }

  async function createTank(data: CreateTankRequest) {
    try {
      setSubmitting(true);
      setError("");

      await FarmRepository.createTank(data);
      await loadDetails(data.idFazenda);
    } catch {
      setError("Não foi possível cadastrar o tanque.");
      throw new Error("Erro ao cadastrar tanque");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTank(id: number, farmId: number, data: UpdateTankRequest) {
    try {
      setSubmitting(true);
      setError("");

      await FarmRepository.updateTank(id, data);
      await loadDetails(farmId);
    } catch {
      setError("Não foi possível atualizar o tanque.");
      throw new Error("Erro ao atualizar tanque");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTank(id: number, farmId: number) {
    try {
      setProcessingId(id);
      setError("");

      await FarmRepository.deleteTank(id);
      await loadDetails(farmId);
    } catch {
      setError(
        "Não foi possível excluir o tanque. Ele pode possuir dispositivos, métricas ou lotes vinculados."
      );
      throw new Error("Erro ao excluir tanque");
    } finally {
      setProcessingId(null);
    }
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
    submitting,
    processingId,
    error,
    reload: loadFarms,
    selectFarm,
    createFarm,
    updateFarm,
    deleteFarm,
    createTank,
    updateTank,
    deleteTank,
  };
}
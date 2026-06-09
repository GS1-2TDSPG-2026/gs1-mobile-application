import { useCallback, useEffect, useState } from "react";

import { FarmRepository } from "../../data/repositories/FarmRepository";
import { IoTDeviceRepository } from "../../data/repositories/IoTDeviceRepository";
import {
  IoTCommandType,
  IoTDevice,
} from "../../domain/models/IoTDevice";

function getErrorMessage(error: unknown): string {
  const typedError = error as {
    message?: string;
  };

  return (
    typedError.message ??
    "Não foi possível carregar o status do dispositivo IoT."
  );
}

export function useIoTDevice() {
  const [device, setDevice] = useState<IoTDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingCommand, setProcessingCommand] =
    useState<IoTCommandType | null>(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadDevice = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setFeedback("");
      setDevice(null);

      const farms = await FarmRepository.getMyFarms();

      if (farms.length === 0) {
        setError(
          "Você ainda não possui fazendas cadastradas. Cadastre uma fazenda para controlar dispositivos IoT."
        );
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
        setError(
          "Você ainda não possui tanques cadastrados. Cadastre um tanque para controlar dispositivos IoT."
        );
        return;
      }

      const data = await IoTDeviceRepository.getDeviceStatus(tankIds);

      setDevice(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const sendCommand = useCallback(
    async (command: IoTCommandType) => {
      try {
        setProcessingCommand(command);
        setError("");
        setFeedback("");

        const result = await IoTDeviceRepository.sendCommand(command);

        setFeedback(result.message);
        await loadDevice();
      } catch {
        setError("Não foi possível enviar o comando para o dispositivo.");
      } finally {
        setProcessingCommand(null);
      }
    },
    [loadDevice]
  );

  useEffect(() => {
    loadDevice();
  }, [loadDevice]);

  return {
    device,
    loading,
    processingCommand,
    error,
    feedback,
    reload: loadDevice,
    sendCommand,
  };
}
import { useCallback, useEffect, useState } from "react";

import { IoTDeviceRepository } from "../../data/repositories/IoTDeviceRepository";
import {
  IoTCommandType,
  IoTDevice,
} from "../../domain/models/IoTDevice";

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

      const data = await IoTDeviceRepository.getDeviceStatus();

      setDevice(data);
    } catch {
      setError("Não foi possível carregar o status do dispositivo IoT.");
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
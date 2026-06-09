import { dotnetApiClient } from "../api/dotnetApiClient";
import {
  TankMetric,
  TankStatus,
  TelemetryDashboard,
} from "../../domain/models/Telemetry";

type ApiMetricaTanque = {
  idMetrica?: number;
  IdMetrica?: number;
  idDispositivo?: number;
  IdDispositivo?: number;
  idTanque?: number;
  IdTanque?: number;
  dtLeitura?: string;
  DtLeitura?: string;
  ph?: number | null;
  Ph?: number | null;
  temperatura?: number | null;
  Temperatura?: number | null;
  turbidez?: number | null;
  Turbidez?: number | null;
  luminosidade?: number | null;
  Luminosidade?: number | null;
  payloadOriginal?: string | null;
  PayloadOriginal?: string | null;
};

type ApiTanque = {
  idTanque?: number;
  IdTanque?: number;
  idFazenda?: number;
  IdFazenda?: number;
  codigoTanque?: string;
  CodigoTanque?: string;
  status?: string;
  Status?: string;
};

type ApiFazenda = {
  idFazenda?: number;
  IdFazenda?: number;
  nome?: string;
  Nome?: string;
};

type ApiDispositivo = {
  idDispositivo?: number;
  IdDispositivo?: number;
  idTanque?: number;
  IdTanque?: number;
  ativo?: string;
  Ativo?: string;
};

type ApiPrevisaoIa = {
  idPrevisao?: number;
  IdPrevisao?: number;
  idTanque?: number;
  IdTanque?: number;
  idFazenda?: number;
  IdFazenda?: number;
  dtPrevisao?: string;
  DtPrevisao?: string;
  dtPicoPrevisto?: string;
  DtPicoPrevisto?: string;
  confiancaPct?: number;
  ConfiancaPct?: number;
};

async function safeGet<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await dotnetApiClient.get<T[]>(endpoint);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.warn(`Falha ao buscar ${endpoint}`, error);
    return [];
  }
}

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getMetricId(item: ApiMetricaTanque): number {
  return toNumber(item.idMetrica ?? item.IdMetrica ?? Date.now());
}

function getTankId(
  item: ApiMetricaTanque | ApiTanque | ApiDispositivo | ApiPrevisaoIa
): number {
  return toNumber(item.idTanque ?? item.IdTanque);
}

function getFazendaId(item: ApiFazenda | ApiTanque | ApiPrevisaoIa): number {
  return toNumber(item.idFazenda ?? item.IdFazenda);
}

function getDateValue(value?: string): number {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function formatRelativeDate(value?: string): string {
  if (!value) {
    return "sem leitura";
  }

  const date = new Date(value);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return "sem leitura";
  }

  const diffMs = Date.now() - time;

  if (diffMs < 0) {
    return "agora";
  }

  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "agora";
  }

  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `há ${diffDays}d`;
}

function formatDateTime(value?: string): string {
  if (!value) {
    return "sem previsão IA cadastrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "sem previsão IA cadastrada";
  }

  return `Pico previsto para ${date.toLocaleDateString(
    "pt-BR"
  )} às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function parsePayloadStatus(payload?: string | null): string {
  if (!payload) {
    return "";
  }

  try {
    const parsed = JSON.parse(payload);

    return String(parsed.status ?? "").toUpperCase();
  } catch {
    return "";
  }
}

function mapStatus(item: ApiMetricaTanque): TankStatus {
  const ph = toNumber(item.ph ?? item.Ph);
  const temperatura = toNumber(item.temperatura ?? item.Temperatura);
  const turbidez = toNumber(item.turbidez ?? item.Turbidez);
  const payloadStatus = parsePayloadStatus(
    item.payloadOriginal ?? item.PayloadOriginal
  );

  if (
    payloadStatus.includes("CRITICO") ||
    payloadStatus.includes("ALERTA_PH") ||
    payloadStatus.includes("PH_CRITICO") ||
    ph <= 0 ||
    ph < 6 ||
    ph > 9 ||
    temperatura < 15 ||
    temperatura > 35
  ) {
    return "CRITICO";
  }

  if (
    payloadStatus.includes("ALERTA") ||
    payloadStatus.includes("FORA") ||
    turbidez > 1000
  ) {
    return "ATENCAO";
  }

  return "NORMAL";
}

function getTankCode(tanque: ApiTanque): string {
  const tankId = getTankId(tanque);

  return tanque.codigoTanque ?? tanque.CodigoTanque ?? `Tanque ${tankId}`;
}

function getTankName(item: ApiMetricaTanque, tanques: ApiTanque[]): string {
  const tankId = getTankId(item);
  const tanque = tanques.find((current) => getTankId(current) === tankId);

  return tanque?.codigoTanque ?? tanque?.CodigoTanque ?? `Tanque ${tankId}`;
}

function mapMetric(item: ApiMetricaTanque, tanques: ApiTanque[]): TankMetric {
  return {
    id: getMetricId(item),
    nomeTanque: getTankName(item, tanques),
    ph: toNumber(item.ph ?? item.Ph),
    temperatura: toNumber(item.temperatura ?? item.Temperatura),
    turbidez: toNumber(item.turbidez ?? item.Turbidez),
    luminosidade: toNumber(item.luminosidade ?? item.Luminosidade),
    status: mapStatus(item),
    ultimaLeitura: formatRelativeDate(item.dtLeitura ?? item.DtLeitura),
  };
}

function mapTankWithoutMetric(tanque: ApiTanque): TankMetric {
  return {
    id: getTankId(tanque),
    nomeTanque: getTankCode(tanque),
    ph: 0,
    temperatura: 0,
    turbidez: 0,
    luminosidade: 0,
    status: "ATENCAO",
    ultimaLeitura: "sem leitura",
  };
}

function getLatestMetricsByTank(
  metricas: ApiMetricaTanque[]
): ApiMetricaTanque[] {
  const latestByTank = new Map<number, ApiMetricaTanque>();

  metricas.forEach((metrica) => {
    const tankId = getTankId(metrica);
    const current = latestByTank.get(tankId);

    if (!current) {
      latestByTank.set(tankId, metrica);
      return;
    }

    const currentId = getMetricId(current);
    const newId = getMetricId(metrica);

    if (newId > currentId) {
      latestByTank.set(tankId, metrica);
    }
  });

  return Array.from(latestByTank.values()).sort(
    (a, b) => getMetricId(b) - getMetricId(a)
  );
}

function getLatestPrediction(
  previsoes: ApiPrevisaoIa[],
  fazendaId?: number,
  tankIds?: Set<number>
): ApiPrevisaoIa | null {
  if (previsoes.length === 0) {
    return null;
  }

  const previsoesFiltradas = previsoes.filter((previsao) => {
    const previsaoFazendaId = getFazendaId(previsao);
    const previsaoTanqueId = getTankId(previsao);

    if (fazendaId && previsaoFazendaId > 0) {
      return previsaoFazendaId === fazendaId;
    }

    if (tankIds && previsaoTanqueId > 0) {
      return tankIds.has(previsaoTanqueId);
    }

    return false;
  });

  if (previsoesFiltradas.length === 0) {
    return null;
  }

  return [...previsoesFiltradas].sort(
    (a, b) =>
      getDateValue(b.dtPrevisao ?? b.DtPrevisao) -
      getDateValue(a.dtPrevisao ?? a.DtPrevisao)
  )[0];
}

function isDeviceActive(dispositivo: ApiDispositivo): boolean {
  return (
    String(dispositivo.ativo ?? dispositivo.Ativo ?? "")
      .toUpperCase()
      .trim() === "S"
  );
}

function emptyDashboard(): TelemetryDashboard {
  return {
    fazendaNome: "Nenhuma fazenda selecionada",
    dispositivoStatus: "OFFLINE",
    previsaoBiomassa: "sem previsão IA cadastrada",
    confiancaIA: 0,
    metricas: [],
  };
}

export const TelemetryRepository = {
  async getDashboard(fazendaId?: number): Promise<TelemetryDashboard> {
    if (!fazendaId) {
      return emptyDashboard();
    }

    const [metricas, tanques, fazendas, dispositivos, previsoes] =
      await Promise.all([
        safeGet<ApiMetricaTanque>("/MetricaTanque"),
        safeGet<ApiTanque>("/Tanque"),
        safeGet<ApiFazenda>("/Fazenda"),
        safeGet<ApiDispositivo>("/DispositivoIot"),
        safeGet<ApiPrevisaoIa>("/PrevisaoIa"),
      ]);

    const fazendaSelecionada = fazendas.find(
      (fazenda) => getFazendaId(fazenda) === fazendaId
    );

    const tanquesDaFazenda = tanques.filter(
      (tanque) => getFazendaId(tanque) === fazendaId
    );

    const idsTanquesDaFazenda = new Set(
      tanquesDaFazenda.map((tanque) => getTankId(tanque))
    );

    const metricasDaFazenda = metricas.filter((metrica) =>
      idsTanquesDaFazenda.has(getTankId(metrica))
    );

    const ultimasMetricasDaFazenda =
      getLatestMetricsByTank(metricasDaFazenda);

    const metricasPorTanque = new Map<number, ApiMetricaTanque>();

    ultimasMetricasDaFazenda.forEach((metrica) => {
      metricasPorTanque.set(getTankId(metrica), metrica);
    });

    const cardsTanques = tanquesDaFazenda.map((tanque) => {
      const idTanque = getTankId(tanque);
      const metrica = metricasPorTanque.get(idTanque);

      if (!metrica) {
        return mapTankWithoutMetric(tanque);
      }

      return mapMetric(metrica, tanques);
    });

    const latestPrediction = getLatestPrediction(
      previsoes,
      fazendaId,
      idsTanquesDaFazenda
    );

    const existeDispositivoAtivo = dispositivos.some((dispositivo) => {
      const idTanqueDispositivo = getTankId(dispositivo);

      return (
        idsTanquesDaFazenda.has(idTanqueDispositivo) &&
        isDeviceActive(dispositivo)
      );
    });

    return {
      fazendaNome:
        fazendaSelecionada?.nome ??
        fazendaSelecionada?.Nome ??
        "Fazenda Phycocarbon",
      dispositivoStatus: existeDispositivoAtivo ? "ONLINE" : "OFFLINE",
      previsaoBiomassa: formatDateTime(
        latestPrediction?.dtPicoPrevisto ?? latestPrediction?.DtPicoPrevisto
      ),
      confiancaIA: Math.round(
        toNumber(
          latestPrediction?.confiancaPct ?? latestPrediction?.ConfiancaPct
        )
      ),
      metricas: cardsTanques,
    };
  },
};
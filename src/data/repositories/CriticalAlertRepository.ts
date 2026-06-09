import { dotnetApiClient } from "../api/dotnetApiClient";
import {
  CriticalAlert,
  CriticalAlertSeverity,
  CriticalAlertStatus,
} from "../../domain/models/CriticalAlert";

type ApiAlertaCritico = {
  idAlerta?: number;
  IdAlerta?: number;
  id?: number;
  Id?: number;

  idTanque?: number;
  IdTanque?: number;

  tipo?: string;
  Tipo?: string;
  tipoAlerta?: string;
  TipoAlerta?: string;

  mensagem?: string;
  Mensagem?: string;

  severidade?: string;
  Severidade?: string;
  nivel?: string;
  Nivel?: string;

  status?: string;
  Status?: string;

  dtCriacao?: string;
  DtCriacao?: string;
  dtAlerta?: string;
  DtAlerta?: string;
  criadoEm?: string;
  CriadoEm?: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getAlertId(alerta: ApiAlertaCritico): number {
  return toNumber(alerta.idAlerta ?? alerta.IdAlerta ?? alerta.id ?? alerta.Id);
}

function getTankId(alerta: ApiAlertaCritico): number {
  return toNumber(alerta.idTanque ?? alerta.IdTanque);
}

function normalizeSeverity(value?: string): CriticalAlertSeverity {
  const normalized = String(value ?? "").toUpperCase().trim();

  if (normalized.includes("CRITICO") || normalized.includes("CRITICAL")) {
    return "CRITICO";
  }

  return "ATENCAO";
}

function normalizeStatus(value?: string): CriticalAlertStatus {
  const normalized = String(value ?? "").toUpperCase().trim();

  if (normalized.includes("RESOLVIDO") || normalized.includes("RESOLVED")) {
    return "RESOLVIDO";
  }

  return "ABERTO";
}

function formatRelativeDate(value?: string): string {
  if (!value) {
    return "sem data";
  }

  const date = new Date(value);
  const time = date.getTime();

  if (Number.isNaN(time)) {
    return "sem data";
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

function mapAlert(alerta: ApiAlertaCritico): CriticalAlert {
  const idTanque = getTankId(alerta);

  return {
    id: getAlertId(alerta),
    tanque: `Tanque ${idTanque}`,
    tipo:
      alerta.tipo ??
      alerta.Tipo ??
      alerta.tipoAlerta ??
      alerta.TipoAlerta ??
      "Alerta crítico",
    mensagem:
      alerta.mensagem ??
      alerta.Mensagem ??
      "Evento crítico detectado no tanque.",
    severidade: normalizeSeverity(
      alerta.severidade ?? alerta.Severidade ?? alerta.nivel ?? alerta.Nivel
    ),
    status: normalizeStatus(alerta.status ?? alerta.Status),
    criadoEm: formatRelativeDate(
      alerta.dtCriacao ??
        alerta.DtCriacao ??
        alerta.dtAlerta ??
        alerta.DtAlerta ??
        alerta.criadoEm ??
        alerta.CriadoEm
    ),
  };
}

export const CriticalAlertRepository = {
  async getAlerts(tankIds: number[]): Promise<CriticalAlert[]> {
    if (!tankIds || tankIds.length === 0) {
      return [];
    }

    const allowedTankIds = new Set(tankIds);

    const response = await dotnetApiClient.get<ApiAlertaCritico[]>(
      "/AlertaCritico"
    );

    const data = Array.isArray(response.data) ? response.data : [];

    return data
      .filter((alerta) => allowedTankIds.has(getTankId(alerta)))
      .map(mapAlert)
      .sort((a, b) => b.id - a.id);
  },

  async resolveAlert(alertId: number): Promise<void> {
    await dotnetApiClient.patch(`/AlertaCritico/${alertId}/resolver`);
  },
};
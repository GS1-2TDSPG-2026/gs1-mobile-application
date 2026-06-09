import { dotnetApiClient } from "../api/dotnetApiClient";
import {
  CriticalAlert,
  CriticalAlertSeverity,
  CriticalAlertStatus,
} from "../../domain/models/CriticalAlert";

type ApiAlertaCritico = {
  idAlerta?: number;
  IdAlerta?: number;
  idTanque?: number;
  IdTanque?: number;
  tipoAlerta?: string;
  TipoAlerta?: string;
  severidade?: string;
  Severidade?: string;
  mensagem?: string;
  Mensagem?: string;
  status?: string;
  Status?: string;
  dtAlerta?: string;
  DtAlerta?: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
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

function normalizeSeverity(value?: string): CriticalAlertSeverity {
  const normalized = String(value ?? "")
    .toUpperCase()
    .trim();

  return normalized.includes("CRIT") ? "CRITICO" : "ATENCAO";
}

function normalizeStatus(value?: string): CriticalAlertStatus {
  const normalized = String(value ?? "")
    .toUpperCase()
    .trim();

  return normalized.includes("RESOL") ? "RESOLVIDO" : "ABERTO";
}

function formatType(value?: string): string {
  return String(value ?? "Alerta crítico")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^./, (letter) => letter.toUpperCase());
}

function mapAlert(item: ApiAlertaCritico): CriticalAlert {
  const idTanque = toNumber(item.idTanque ?? item.IdTanque);

  return {
    id: toNumber(item.idAlerta ?? item.IdAlerta),
    tanque: `Tanque ${idTanque}`,
    tipo: formatType(item.tipoAlerta ?? item.TipoAlerta),
    mensagem: String(
      item.mensagem ?? item.Mensagem ?? "Alerta crítico detectado."
    ),
    severidade: normalizeSeverity(item.severidade ?? item.Severidade),
    status: normalizeStatus(item.status ?? item.Status),
    criadoEm: formatRelativeDate(item.dtAlerta ?? item.DtAlerta),
  };
}

export const CriticalAlertRepository = {
  async getAlerts(): Promise<CriticalAlert[]> {
    const response = await dotnetApiClient.get<ApiAlertaCritico[]>(
      "/AlertaCritico"
    );

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(mapAlert).sort((a, b) => b.id - a.id);
  },

  async resolveAlert(alertId: number): Promise<void> {
    await dotnetApiClient.patch(`/AlertaCritico/${alertId}/resolver`);
  },
};
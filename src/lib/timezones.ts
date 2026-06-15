export interface TzEntry {
  label: string;
  offset: number;
}

export const TZ_OFFSETS: Record<string, TzEntry> = {
  utc:   { label: 'UTC',          offset: 0  },
  es:    { label: 'Madrid',       offset: +2 },
  mx:    { label: 'CDMX',         offset: -5 },
  co:    { label: 'Bogotá',       offset: -5 },
  ar:    { label: 'Buenos Aires', offset: -3 },
  cl:    { label: 'Santiago',     offset: -3 },
  pe:    { label: 'Lima',         offset: -5 },
  ve:    { label: 'Caracas',      offset: -4 },
  us_et: { label: 'ET',           offset: -4 },
  pt:    { label: 'Lisboa',       offset: +1 },
  de:    { label: 'Berlín',       offset: +2 },
};

export function applyOffset(timeUtc: string, offset: number): string {
  const [h, m] = timeUtc.split(':').map(Number);
  let totalMin = h * 60 + m + offset * 60;
  totalMin = ((totalMin % 1440) + 1440) % 1440;
  const hh = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const mm = String(totalMin % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function timezoneRow(timeUtc: string): string {
  const parts = [
    `${timeUtc} UTC`,
    `${applyOffset(timeUtc, TZ_OFFSETS.es.offset)} Madrid`,
    `${applyOffset(timeUtc, TZ_OFFSETS.mx.offset)} CDMX`,
    `${applyOffset(timeUtc, TZ_OFFSETS.co.offset)} Bogotá`,
    `${applyOffset(timeUtc, TZ_OFFSETS.ar.offset)} Buenos Aires`,
  ];
  return parts.join(' · ');
}

const MONTH_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAY_ES   = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export function formatDateEs(isoDate: string): string {
  const d = new Date(isoDate);
  return `${DAY_ES[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_ES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

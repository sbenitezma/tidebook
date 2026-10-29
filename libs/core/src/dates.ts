import type { IsoDate, Stay } from './types';

const DAY_MS = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses as UTC midnight so day arithmetic never crosses a daylight saving change. */
const toUtc = (value: IsoDate) => Date.parse(`${value}T00:00:00Z`);

export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const time = toUtc(value);
  // Rejects dates like 2026-02-30, which Date silently rolls over.
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(value);
}

export function toIsoDate(date: Date): IsoDate {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return new Date(toUtc(date) + days * DAY_MS).toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: IsoDate, checkOut: IsoDate): number {
  return Math.round((toUtc(checkOut) - toUtc(checkIn)) / DAY_MS);
}

export type StayError =
  'invalid-check-in' | 'invalid-check-out' | 'check-in-in-past' | 'check-out-not-after-check-in';

export function validateStay({ checkIn, checkOut }: Stay, today: IsoDate): StayError[] {
  const errors: StayError[] = [];
  if (!isIsoDate(checkIn)) errors.push('invalid-check-in');
  if (!isIsoDate(checkOut)) errors.push('invalid-check-out');
  if (errors.length) return errors;
  if (checkIn < today) errors.push('check-in-in-past');
  if (nightsBetween(checkIn, checkOut) < 1) errors.push('check-out-not-after-check-in');
  return errors;
}

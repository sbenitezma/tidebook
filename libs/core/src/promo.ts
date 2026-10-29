import type { IsoDate, PromoCode, PromoResult } from './types';

/**
 * Looks the code up in the known list. The input is never interpreted as a number, so
 * `?promo=100` is just an unknown code.
 */
export function validatePromoCode(
  input: string | null | undefined,
  codes: readonly PromoCode[],
  today: IsoDate,
): PromoResult {
  const code = input?.trim().toUpperCase();
  if (!code) return { status: 'empty' };
  const match = codes.find((promo) => promo.code === code);
  if (!match) return { status: 'unknown', code };
  if (today > match.expiresOn) return { status: 'expired', code };
  return { status: 'valid', code, percent: match.percent };
}

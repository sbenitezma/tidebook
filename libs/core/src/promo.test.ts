import { describe, expect, it } from 'vitest';
import { validatePromoCode } from './promo';
import type { PromoCode } from './types';

const codes: PromoCode[] = [
  { code: 'WELCOME10', percent: 10, expiresOn: '2026-12-31' },
  { code: 'SPRING20', percent: 20, expiresOn: '2026-05-31' },
];
const today = '2026-07-01';

describe('validatePromoCode', () => {
  it('accepts a known code and returns its percentage', () => {
    expect(validatePromoCode('WELCOME10', codes, today)).toEqual({
      status: 'valid',
      code: 'WELCOME10',
      percent: 10,
    });
  });

  it('ignores case and surrounding spaces', () => {
    expect(validatePromoCode('  welcome10 ', codes, today)).toMatchObject({ status: 'valid' });
  });

  it('is still valid on its expiry day', () => {
    expect(validatePromoCode('WELCOME10', codes, '2026-12-31')).toMatchObject({ status: 'valid' });
  });

  it('rejects an expired code', () => {
    expect(validatePromoCode('SPRING20', codes, today)).toEqual({
      status: 'expired',
      code: 'SPRING20',
    });
  });

  it('rejects an unknown code', () => {
    expect(validatePromoCode('FREESTAY', codes, today)).toEqual({
      status: 'unknown',
      code: 'FREESTAY',
    });
  });

  it('never treats a number as a discount percentage', () => {
    expect(validatePromoCode('100', codes, today)).toEqual({ status: 'unknown', code: '100' });
  });

  it.each([null, undefined, '', '   '])('reports %j as empty', (input) => {
    expect(validatePromoCode(input, codes, today)).toEqual({ status: 'empty' });
  });
});

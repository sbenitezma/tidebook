import { describe, expect, it } from 'vitest';
import { promoMessage } from './messages';

describe('promoMessage', () => {
  it('describes each promo result', () => {
    expect(promoMessage({ status: 'valid', code: 'WELCOME10', percent: 10 })).toEqual({
      variant: 'success',
      text: 'WELCOME10 applied: 10% off your stay.',
    });
    expect(promoMessage({ status: 'expired', code: 'SPRING20' })?.variant).toBe('danger');
    expect(promoMessage({ status: 'unknown', code: '100' })?.text).toContain('recognise 100');
    expect(promoMessage({ status: 'empty' })).toBeNull();
  });
});

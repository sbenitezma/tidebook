import { describe, expect, it } from 'vitest';
import { isIsoDate } from '../dates';
import { promoCodes, rooms } from './index';

describe('mock data', () => {
  it('has rooms with unique ids and whole-cent prices', () => {
    expect(new Set(rooms.map((room) => room.id)).size).toBe(rooms.length);
    for (const room of rooms) {
      expect(['room', 'bungalow']).toContain(room.type);
      expect(Number.isInteger(room.pricePerNightCents)).toBe(true);
      expect(room.maxGuests).toBeGreaterThan(0);
    }
  });

  it('has promo codes in upper case with valid percentages and dates', () => {
    for (const promo of promoCodes) {
      expect(promo.code).toBe(promo.code.toUpperCase());
      expect(Number.isInteger(promo.percent) && promo.percent > 0 && promo.percent <= 100).toBe(
        true,
      );
      expect(isIsoDate(promo.expiresOn)).toBe(true);
    }
  });
});

import type { Guests, Room } from './types';

export const GUEST_LIMITS = {
  adults: { min: 1, max: 4 },
  children: { min: 0, max: 3 },
} as const;

export type GuestsError = 'adults-out-of-range' | 'children-out-of-range';

const inRange = (value: number, { min, max }: { min: number; max: number }) =>
  Number.isInteger(value) && value >= min && value <= max;

export function validateGuests({ adults, children }: Guests): GuestsError[] {
  const errors: GuestsError[] = [];
  if (!inRange(adults, GUEST_LIMITS.adults)) errors.push('adults-out-of-range');
  if (!inRange(children, GUEST_LIMITS.children)) errors.push('children-out-of-range');
  return errors;
}

export interface Capacity {
  fits: boolean;
  guests: number;
  maxGuests: number;
}

export function checkCapacity(room: Pick<Room, 'maxGuests'>, guests: Guests): Capacity {
  const total = guests.adults + guests.children;
  return { fits: total <= room.maxGuests, guests: total, maxGuests: room.maxGuests };
}

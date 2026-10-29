import type { PromoCode, Room } from '../types';
import promoCodesJson from './promo-codes.json';
import roomsJson from './rooms.json';

/** Mock data standing in for an API in v1. */
export const rooms = roomsJson as Room[];
export const promoCodes: PromoCode[] = promoCodesJson;

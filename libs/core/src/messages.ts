import type { BookingIssue } from './booking';
import type { PromoResult } from './types';

/** User-facing copy for booking issues and promo results, shared by every app. */
export const issueMessages: Record<Exclude<BookingIssue, 'over-capacity'>, string> = {
  'invalid-check-in': 'Choose a valid check-in date.',
  'invalid-check-out': 'Choose a valid check-out date.',
  'check-in-in-past': 'Check-in cannot be in the past.',
  'check-out-not-after-check-in': 'Check-out must be at least one night after check-in.',
  'adults-out-of-range': 'Choose between 1 and 4 adults.',
  'children-out-of-range': 'Choose between 0 and 3 children.',
  'no-room-selected': 'Select a room or bungalow to continue.',
};

export function promoMessage(
  promo: PromoResult,
): { variant: 'success' | 'danger'; text: string } | null {
  switch (promo.status) {
    case 'valid':
      return {
        variant: 'success',
        text: `${promo.code} applied: ${promo.percent}% off your stay.`,
      };
    case 'expired':
      return { variant: 'danger', text: `${promo.code} has expired, so no discount was applied.` };
    case 'unknown':
      return {
        variant: 'danger',
        text: `We don't recognise ${promo.code}. Check the code and try again.`,
      };
    case 'empty':
      return null;
  }
}

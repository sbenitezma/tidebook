/** Calendar date in `YYYY-MM-DD` format. */
export type IsoDate = string;

export type RoomType = 'room' | 'bungalow';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  sizeM2: number;
  beds: number;
  bedType: string;
  maxGuests: number;
  pricePerNightCents: number;
  /** Path to the photo, relative to the app's public folder; a `@2x` file sits next to it. */
  image: string;
}

export interface PromoCode {
  code: string;
  percent: number;
  /** Last day the code can be used (inclusive). */
  expiresOn: IsoDate;
}

export interface Stay {
  checkIn: IsoDate;
  checkOut: IsoDate;
}

export interface Guests {
  adults: number;
  children: number;
}

export interface Quote {
  nights: number;
  pricePerNightCents: number;
  subtotalCents: number;
  discountPercent: number;
  discountCents: number;
  totalCents: number;
}

export type PromoResult =
  | { status: 'valid'; code: string; percent: number }
  | { status: 'expired' | 'unknown'; code: string }
  | { status: 'empty' };

export interface Booking {
  reference: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  stay: Stay;
  guests: Guests;
  promoCode: string | null;
  quote: Quote;
}

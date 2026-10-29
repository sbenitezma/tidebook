import { useEffect, useRef } from 'react';
import { formatMoney, type Booking } from '@tidebook/core';

const longDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const formatDate = (isoDate: string) => longDate.format(new Date(`${isoDate}T00:00:00Z`));

export function Confirmation(props: { booking: Booking; saved: boolean; onDone: () => void }) {
  const { booking, saved, onDone } = props;
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus to the new content so keyboard and screen reader users land on it.
  useEffect(() => heading.current?.focus(), []);

  const { quote } = booking;
  return (
    <section className="confirmation" aria-labelledby="confirmation-title">
      <h1 id="confirmation-title" ref={heading} tabIndex={-1}>
        Your stay is booked
      </h1>
      <tb-alert variant="success" heading={`Booking reference ${booking.reference}`}>
        Keep this reference to manage your stay.
      </tb-alert>
      {!saved && (
        <tb-alert variant="info">
          Your browser blocks local storage, so this booking will not be remembered on this device.
        </tb-alert>
      )}
      <tb-price-summary
        heading={booking.roomName}
        nights={quote.nights}
        pricePerNight={formatMoney(quote.pricePerNightCents)}
        subtotal={formatMoney(quote.subtotalCents)}
        discount={quote.discountCents ? formatMoney(quote.discountCents) : ''}
        discountLabel={`${booking.promoCode} (${quote.discountPercent}%)`}
        total={formatMoney(quote.totalCents)}
      >
        <dl className="details">
          <dt>Check-in</dt>
          <dd>{formatDate(booking.stay.checkIn)}</dd>
          <dt>Check-out</dt>
          <dd>{formatDate(booking.stay.checkOut)}</dd>
          <dt>Guests</dt>
          <dd>
            {booking.guests.adults} adult{booking.guests.adults === 1 ? '' : 's'}
            {booking.guests.children > 0 &&
              `, ${booking.guests.children} child${booking.guests.children === 1 ? '' : 'ren'}`}
          </dd>
        </dl>
      </tb-price-summary>
      <tb-button variant="secondary" onClick={onDone}>
        Book another stay
      </tb-button>
    </section>
  );
}

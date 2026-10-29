import { useState } from 'react';
import {
  addDays,
  createBooking,
  formatMoney,
  nightsBetween,
  promoCodes,
  quoteStay,
  rooms,
  saveBooking,
  toIsoDate,
  validateBooking,
  validateStay,
  validatePromoCode,
  GUEST_LIMITS,
  issueMessages,
  promoMessage,
  type Booking,
  type StorageLike,
} from '@tidebook/core';
import { Confirmation } from './Confirmation';

/** `window.localStorage` itself throws when the browser blocks storage. */
function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function App() {
  const [today] = useState(() => toIsoDate(new Date()));
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => addDays(today, 1));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState<string>();
  const [promoInput, setPromoInput] = useState(
    () => new URLSearchParams(window.location.search).get('promo') ?? '',
  );
  const [promo, setPromo] = useState(() => validatePromoCode(promoInput, promoCodes, today));
  const [confirmed, setConfirmed] = useState<{ booking: Booking; saved: boolean }>();

  const room = rooms.find((candidate) => candidate.id === roomId);
  const stay = { checkIn, checkOut };
  const guests = { adults, children };
  const issues = validateBooking({ room, stay, guests }, today);
  const quote =
    room && validateStay(stay, today).length === 0
      ? quoteStay({
          pricePerNightCents: room.pricePerNightCents,
          nights: nightsBetween(checkIn, checkOut),
          discountPercent: promo.status === 'valid' ? promo.percent : 0,
        })
      : undefined;

  const changeCheckIn = (value: string) => {
    setCheckIn(value);
    // Keep at least one night so the guest does not have to fix check-out by hand.
    if (value && nightsBetween(value, checkOut) < 1) setCheckOut(addDays(value, 1));
  };

  const confirm = () => {
    if (!room || issues.length) return;
    const booking = createBooking({ room, stay, guests, promo }, { today });
    setConfirmed({ booking, saved: saveBooking(booking, browserStorage()) });
    window.scrollTo({ top: 0 });
  };

  const startOver = () => {
    setConfirmed(undefined);
    setRoomId(undefined);
  };

  const fieldError = (...keys: (keyof typeof issueMessages)[]) =>
    keys.map((key) => (issues.includes(key) ? issueMessages[key] : '')).find(Boolean) ?? '';

  const promoFeedback = promoMessage(promo);
  const blocking = issues.filter((issue) => issue !== 'no-room-selected');

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <tb-header />
      <main id="main" className="page">
        {confirmed ? (
          <Confirmation booking={confirmed.booking} saved={confirmed.saved} onDone={startOver} />
        ) : (
          <>
            <section className="hero" aria-labelledby="hero-title">
              <h1 id="hero-title">Stays where the tide sets the pace</h1>
              <p>
                Rooms and bungalows a few steps from the sea. Pick your dates and find your spot.
              </p>
            </section>

            <section className="card search" aria-labelledby="search-title">
              <h2 id="search-title" className="visually-hidden">
                Your dates and guests
              </h2>
              <tb-date-field
                label="Check-in"
                value={checkIn}
                min={today}
                error={fieldError('invalid-check-in', 'check-in-in-past')}
                ontb-date-change={(event) => changeCheckIn(event.detail.value)}
              />
              <tb-date-field
                label="Check-out"
                value={checkOut}
                min={addDays(checkIn || today, 1)}
                error={fieldError('invalid-check-out', 'check-out-not-after-check-in')}
                ontb-date-change={(event) => setCheckOut(event.detail.value)}
              />
              <tb-counter
                label="Adults"
                value={adults}
                min={GUEST_LIMITS.adults.min}
                max={GUEST_LIMITS.adults.max}
                ontb-count-change={(event) => setAdults(event.detail.value)}
              />
              <tb-counter
                label="Children"
                value={children}
                min={GUEST_LIMITS.children.min}
                max={GUEST_LIMITS.children.max}
                ontb-count-change={(event) => setChildren(event.detail.value)}
              />
            </section>

            <div className="layout">
              <section aria-labelledby="rooms-title">
                <h2 id="rooms-title">Rooms and bungalows</h2>
                <ul className="rooms" role="list">
                  {rooms.map((candidate) => (
                    <li key={candidate.id}>
                      <tb-room-card
                        room={candidate}
                        price={formatMoney(candidate.pricePerNightCents)}
                        selected={candidate.id === roomId}
                        ontb-select={(event) => setRoomId(event.detail.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <aside id="summary" className="summary" aria-labelledby="summary-title">
                <h2 id="summary-title" className="visually-hidden">
                  Booking summary
                </h2>
                {room && quote ? (
                  <tb-price-summary
                    heading={room.name}
                    nights={quote.nights}
                    pricePerNight={formatMoney(quote.pricePerNightCents)}
                    subtotal={formatMoney(quote.subtotalCents)}
                    discount={quote.discountCents ? formatMoney(quote.discountCents) : ''}
                    discountLabel={
                      promo.status === 'valid' ? `${promo.code} (${promo.percent}%)` : ''
                    }
                    total={formatMoney(quote.totalCents)}
                  >
                    <div className="stack">
                      {issues.includes('over-capacity') && (
                        <tb-alert variant="warning" heading="Too many guests for this room">
                          {room.name} sleeps up to {room.maxGuests}; your group is{' '}
                          {adults + children}. Choose a larger room or fewer guests.
                        </tb-alert>
                      )}
                      <PromoForm
                        value={promoInput}
                        onChange={setPromoInput}
                        onApply={() => setPromo(validatePromoCode(promoInput, promoCodes, today))}
                      />
                      {promoFeedback && (
                        <tb-alert variant={promoFeedback.variant}>{promoFeedback.text}</tb-alert>
                      )}
                      <tb-button block disabled={issues.length > 0} onClick={confirm}>
                        Confirm booking
                      </tb-button>
                    </div>
                  </tb-price-summary>
                ) : (
                  <div className="card empty">
                    {blocking.length ? (
                      <tb-alert variant="danger" heading="Check your search">
                        {blocking.map((issue) =>
                          issue === 'over-capacity' ? null : (
                            <p key={issue}>{issueMessages[issue]}</p>
                          ),
                        )}
                      </tb-alert>
                    ) : (
                      <p>{issueMessages['no-room-selected']}</p>
                    )}
                    {promoFeedback && (
                      <tb-alert variant={promoFeedback.variant}>{promoFeedback.text}</tb-alert>
                    )}
                  </div>
                )}
              </aside>
            </div>

            {room && quote && (
              <a className="mobile-bar" href="#summary">
                <span>
                  {room.name} · <strong>{formatMoney(quote.totalCents)}</strong>
                </span>
                <span aria-hidden="true">Review ↓</span>
              </a>
            )}
          </>
        )}
      </main>
      <tb-footer>
        Tidebook is a portfolio project: no real bookings are made. Made by{' '}
        <a href="https://github.com/sbenitezma">Sonia Benítez</a>.
      </tb-footer>
    </>
  );
}

function PromoForm(props: {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
}) {
  return (
    <div className="promo">
      <tb-text-field
        label="Promo code"
        value={props.value}
        placeholder="e.g. WELCOME10"
        ontb-input={(event) => props.onChange(event.detail.value)}
        onKeyDown={(event) => event.key === 'Enter' && props.onApply()}
      />
      <tb-button variant="secondary" onClick={props.onApply}>
        Apply
      </tb-button>
    </div>
  );
}

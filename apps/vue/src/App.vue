<script setup lang="ts">
import { computed, ref } from 'vue';
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
import BookingConfirmation from './BookingConfirmation.vue';

/** `window.localStorage` itself throws when the browser blocks storage. */
function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

const today = toIsoDate(new Date());
const checkIn = ref(today);
const checkOut = ref(addDays(today, 1));
const adults = ref(2);
const children = ref(0);
const roomId = ref<string>();
const promoInput = ref(new URLSearchParams(window.location.search).get('promo') ?? '');
const promo = ref(validatePromoCode(promoInput.value, promoCodes, today));
const confirmed = ref<{ booking: Booking; saved: boolean }>();

const room = computed(() => rooms.find((candidate) => candidate.id === roomId.value));
const stay = computed(() => ({ checkIn: checkIn.value, checkOut: checkOut.value }));
const guests = computed(() => ({ adults: adults.value, children: children.value }));
const issues = computed(() =>
  validateBooking({ room: room.value, stay: stay.value, guests: guests.value }, today),
);
const quote = computed(() =>
  room.value && validateStay(stay.value, today).length === 0
    ? quoteStay({
        pricePerNightCents: room.value.pricePerNightCents,
        nights: nightsBetween(checkIn.value, checkOut.value),
        discountPercent: promo.value.status === 'valid' ? promo.value.percent : 0,
      })
    : undefined,
);
const promoFeedback = computed(() => promoMessage(promo.value));
const blocking = computed(() =>
  issues.value.filter(
    (issue): issue is keyof typeof issueMessages =>
      issue !== 'no-room-selected' && issue !== 'over-capacity',
  ),
);

const fieldError = (...keys: (keyof typeof issueMessages)[]) =>
  keys.map((key) => (issues.value.includes(key) ? issueMessages[key] : '')).find(Boolean) ?? '';

function changeCheckIn(value: string) {
  checkIn.value = value;
  // Keep at least one night so the guest does not have to fix check-out by hand.
  if (value && nightsBetween(value, checkOut.value) < 1) checkOut.value = addDays(value, 1);
}

function applyPromo() {
  promo.value = validatePromoCode(promoInput.value, promoCodes, today);
}

function confirm() {
  if (!room.value || issues.value.length) return;
  const booking = createBooking(
    { room: room.value, stay: stay.value, guests: guests.value, promo: promo.value },
    { today },
  );
  confirmed.value = { booking, saved: saveBooking(booking, browserStorage()) };
  window.scrollTo({ top: 0 });
}

function startOver() {
  confirmed.value = undefined;
  roomId.value = undefined;
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <tb-header />
  <main id="main" class="page">
    <BookingConfirmation
      v-if="confirmed"
      :booking="confirmed.booking"
      :saved="confirmed.saved"
      @done="startOver"
    />
    <template v-else>
      <section class="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Stays where the tide sets the pace</h1>
        <p>Rooms and bungalows a few steps from the sea. Pick your dates and find your spot.</p>
      </section>

      <section class="card search" aria-labelledby="search-title">
        <h2 id="search-title" class="visually-hidden">Your dates and guests</h2>
        <tb-date-field
          label="Check-in"
          :value="checkIn"
          :min="today"
          :error="fieldError('invalid-check-in', 'check-in-in-past')"
          @tb-date-change="changeCheckIn($event.detail.value)"
        />
        <tb-date-field
          label="Check-out"
          :value="checkOut"
          :min="addDays(checkIn || today, 1)"
          :error="fieldError('invalid-check-out', 'check-out-not-after-check-in')"
          @tb-date-change="checkOut = $event.detail.value"
        />
        <tb-counter
          label="Adults"
          :value="adults"
          :min="GUEST_LIMITS.adults.min"
          :max="GUEST_LIMITS.adults.max"
          @tb-count-change="adults = $event.detail.value"
        />
        <tb-counter
          label="Children"
          :value="children"
          :min="GUEST_LIMITS.children.min"
          :max="GUEST_LIMITS.children.max"
          @tb-count-change="children = $event.detail.value"
        />
      </section>

      <div class="layout">
        <section aria-labelledby="rooms-title">
          <h2 id="rooms-title">Rooms and bungalows</h2>
          <ul class="rooms" role="list">
            <li v-for="candidate in rooms" :key="candidate.id">
              <tb-room-card
                :room="candidate"
                :price="formatMoney(candidate.pricePerNightCents)"
                :selected="candidate.id === roomId"
                @tb-select="roomId = $event.detail.id"
              />
            </li>
          </ul>
        </section>

        <aside id="summary" class="summary" aria-labelledby="summary-title">
          <h2 id="summary-title" class="visually-hidden">Booking summary</h2>
          <tb-price-summary
            v-if="room && quote"
            :heading="room.name"
            :nights="quote.nights"
            :pricePerNight="formatMoney(quote.pricePerNightCents)"
            :subtotal="formatMoney(quote.subtotalCents)"
            :discount="quote.discountCents ? formatMoney(quote.discountCents) : ''"
            :discountLabel="promo.status === 'valid' ? `${promo.code} (${promo.percent}%)` : ''"
            :total="formatMoney(quote.totalCents)"
          >
            <div class="stack">
              <tb-alert
                v-if="issues.includes('over-capacity')"
                variant="warning"
                heading="Too many guests for this room"
              >
                {{ room.name }} sleeps up to {{ room.maxGuests }}; your group is
                {{ adults + children }}. Choose a larger room or fewer guests.
              </tb-alert>
              <div class="promo">
                <tb-text-field
                  label="Promo code"
                  :value="promoInput"
                  placeholder="e.g. WELCOME10"
                  @tb-input="promoInput = $event.detail.value"
                  @keydown.enter="applyPromo"
                />
                <tb-button variant="secondary" @click="applyPromo">Apply</tb-button>
              </div>
              <tb-alert v-if="promoFeedback" :variant="promoFeedback.variant">
                {{ promoFeedback.text }}
              </tb-alert>
              <tb-button block :disabled="issues.length > 0" @click="confirm">
                Confirm booking
              </tb-button>
            </div>
          </tb-price-summary>
          <div v-else class="card empty">
            <tb-alert v-if="blocking.length" variant="danger" heading="Check your search">
              <p v-for="issue in blocking" :key="issue">{{ issueMessages[issue] }}</p>
            </tb-alert>
            <p v-else>{{ issueMessages['no-room-selected'] }}</p>
            <tb-alert v-if="promoFeedback" :variant="promoFeedback.variant">
              {{ promoFeedback.text }}
            </tb-alert>
          </div>
        </aside>
      </div>

      <a v-if="room && quote" class="mobile-bar" href="#summary">
        <span>
          {{ room.name }} · <strong>{{ formatMoney(quote.totalCents) }}</strong>
        </span>
        <span aria-hidden="true">Review ↓</span>
      </a>
    </template>
  </main>
  <tb-footer>
    Tidebook is a portfolio project: no real bookings are made. Made by
    <a href="https://github.com/sbenitezma">Sonia Benítez</a>.
  </tb-footer>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { formatLongDate, formatMoney, type Booking } from '@tidebook/core';

const { booking, saved } = defineProps<{ booking: Booking; saved: boolean }>();
const emit = defineEmits<{ done: [] }>();

const { adults, children } = booking.guests;
const guestsLabel =
  `${adults} adult${adults === 1 ? '' : 's'}` +
  (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '');

const heading = useTemplateRef('heading');

// Move focus to the new content so keyboard and screen reader users land on it.
onMounted(() => heading.value?.focus());
</script>

<template>
  <section class="confirmation" aria-labelledby="confirmation-title">
    <h1 id="confirmation-title" ref="heading" tabindex="-1">Your stay is booked</h1>
    <tb-alert variant="success" :heading="`Booking reference ${booking.reference}`">
      Keep this reference to manage your stay.
    </tb-alert>
    <tb-alert v-if="!saved" variant="info">
      Your browser blocks local storage, so this booking will not be remembered on this device.
    </tb-alert>
    <tb-price-summary
      :heading="booking.roomName"
      :nights="booking.quote.nights"
      :pricePerNight="formatMoney(booking.quote.pricePerNightCents)"
      :subtotal="formatMoney(booking.quote.subtotalCents)"
      :discount="booking.quote.discountCents ? formatMoney(booking.quote.discountCents) : ''"
      :discountLabel="`${booking.promoCode} (${booking.quote.discountPercent}%)`"
      :total="formatMoney(booking.quote.totalCents)"
    >
      <dl class="details">
        <dt>Check-in</dt>
        <dd>{{ formatLongDate(booking.stay.checkIn) }}</dd>
        <dt>Check-out</dt>
        <dd>{{ formatLongDate(booking.stay.checkOut) }}</dd>
        <dt>Guests</dt>
        <dd>{{ guestsLabel }}</dd>
      </dl>
    </tb-price-summary>
    <tb-button variant="secondary" @click="emit('done')">Book another stay</tb-button>
  </section>
</template>

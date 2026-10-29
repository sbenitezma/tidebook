import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '@tidebook/ui';
import { BOOKINGS_STORAGE_KEY, rooms } from '@tidebook/core';
import { App } from './App';

// Lets React know this environment supports act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const render = async (search = '') => {
  window.history.replaceState(null, '', `/${search}`);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<App />));
};

const $ = <E extends Element>(selector: string) => container.querySelector<E>(selector);

const selectRoom = async (id: string) => {
  const card = [...container.querySelectorAll('tb-room-card')].find((c) => c.room?.id === id)!;
  await act(async () => {
    card.dispatchEvent(new CustomEvent('tb-select', { detail: { id }, bubbles: true }));
  });
};

beforeEach(() => localStorage.clear());
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('App', () => {
  it('lists every room, passing data as element properties', async () => {
    await render();
    const cards = container.querySelectorAll('tb-room-card');
    expect(cards).toHaveLength(rooms.length);
    expect(cards[0]?.room).toEqual(rooms[0]);
    expect($('tb-price-summary')).toBeNull();
  });

  it('applies a valid promo code from the URL and books the stay', async () => {
    await render('?promo=welcome10');
    await selectRoom('salt-marsh');

    const summary = $<HTMLElementTagNameMap['tb-price-summary']>('tb-price-summary')!;
    expect(summary.subtotal).toBe('€120.00');
    expect(summary.discount).toBe('€12.00');
    expect(summary.total).toBe('€108.00');
    expect(container.textContent).toContain('WELCOME10 applied');

    const confirm = [...container.querySelectorAll('tb-button')].find((b) =>
      b.textContent?.includes('Confirm'),
    )!;
    await act(async () => confirm.click());

    expect(container.querySelector('h1')?.textContent).toBe('Your stay is booked');
    const stored = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)!);
    expect(stored[0].quote.totalCents).toBe(10800);
  });

  it('ignores a numeric promo code', async () => {
    await render('?promo=100');
    await selectRoom('driftwood');
    expect($<HTMLElementTagNameMap['tb-price-summary']>('tb-price-summary')?.discount).toBe('');
    expect(container.textContent).toContain("We don't recognise 100");
  });

  it('warns when the group is larger than the room', async () => {
    await render();
    const adults = $('tb-counter')!;
    await act(async () => {
      adults.dispatchEvent(new CustomEvent('tb-count-change', { detail: { value: 3 } }));
    });
    await selectRoom('driftwood');
    const warning = $<HTMLElementTagNameMap['tb-alert']>('tb-alert[variant="warning"]');
    expect(warning?.heading).toBe('Too many guests for this room');
    expect(warning?.textContent).toContain('sleeps up to 2; your group is 3');
  });
});

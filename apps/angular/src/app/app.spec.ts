import { TestBed, type ComponentFixture } from '@angular/core/testing';
import '@tidebook/ui';
import { BOOKINGS_STORAGE_KEY, rooms } from '@tidebook/core';
import { App } from './app';

let fixture: ComponentFixture<App>;
let container: HTMLElement;

const render = async (search = '') => {
  window.history.replaceState(null, '', `/${search}`);
  fixture = TestBed.createComponent(App);
  container = fixture.nativeElement;
  await fixture.whenStable();
};

const $ = <E extends Element>(selector: string) => container.querySelector<E>(selector);

const fire = async (target: Element, type: string, detail: unknown) => {
  target.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
  await fixture.whenStable();
};

const selectRoom = (id: string) => {
  const card = [...container.querySelectorAll('tb-room-card')].find((c) => c.room?.id === id)!;
  return fire(card, 'tb-select', { id });
};

beforeEach(() => localStorage.clear());

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
    confirm.click();
    await fixture.whenStable();

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
    await fire($('tb-counter')!, 'tb-count-change', { value: 3 });
    await selectRoom('driftwood');
    const warning = $<HTMLElementTagNameMap['tb-alert']>('tb-alert[variant="warning"]');
    expect(warning?.heading).toBe('Too many guests for this room');
    expect(warning?.textContent).toContain('sleeps up to 2; your group is 3');
  });
});

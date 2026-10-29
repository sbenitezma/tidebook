import { afterEach, describe, expect, it, vi } from 'vitest';
import './index';
import type { RoomCardData } from './room-card';
import { mount, shadow } from './test-utils';

afterEach(() => document.body.replaceChildren());

const room: RoomCardData = {
  id: 'seagrass',
  name: 'Seagrass Bungalow',
  type: 'bungalow',
  description: 'Near the sand.',
  sizeM2: 40,
  beds: 2,
  bedType: 'Queen',
  maxGuests: 4,
  image: 'rooms/seagrass.svg',
};

describe('tb-button', () => {
  it('renders a native button and reflects its state', async () => {
    const button = await mount('tb-button', { variant: 'secondary', disabled: true, block: true });
    const inner = shadow(button).querySelector('button')!;
    expect(inner.className).toBe('secondary');
    expect(inner.disabled).toBe(true);
    expect(button.hasAttribute('block')).toBe(true);
  });
});

describe('tb-badge', () => {
  it('defaults to the neutral variant', async () => {
    const badge = await mount('tb-badge');
    expect(badge.getAttribute('variant')).toBe('neutral');
  });
});

describe('tb-alert', () => {
  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'alert'],
    ['danger', 'alert'],
  ] as const)('uses the right live region for %s', async (variant, role) => {
    const alert = await mount('tb-alert', { variant, heading: 'Heads up' });
    expect(shadow(alert).querySelector('div')?.getAttribute('role')).toBe(role);
    expect(shadow(alert).querySelector('strong')?.textContent).toBe('Heads up');
  });

  it('renders without heading', async () => {
    const alert = await mount('tb-alert');
    expect(shadow(alert).querySelector('strong')).toBeNull();
  });
});

describe('tb-room-card', () => {
  it('renders nothing without a room', async () => {
    const card = await mount('tb-room-card');
    expect(shadow(card).querySelector('article')).toBeNull();
  });

  it('shows the room details and emits tb-select with its id', async () => {
    const card = await mount('tb-room-card', { room, price: '€165.00' });
    const root = shadow(card);
    expect(root.querySelector('h3')?.textContent).toBe('Seagrass Bungalow');
    expect(root.querySelector('tb-badge')?.getAttribute('variant')).toBe('accent');
    expect(root.textContent).toContain('40 m²');
    expect(root.textContent).toContain('Up to 4');
    expect(root.querySelector('.price')?.textContent).toContain('€165.00');
    expect(root.querySelector('img')?.getAttribute('src')).toBe('rooms/seagrass.svg');

    const listener = vi.fn();
    card.addEventListener('tb-select', (event) => listener(event.detail.id));
    (root.querySelector('tb-button') as HTMLElement).click();
    expect(listener).toHaveBeenCalledWith('seagrass');
  });

  it('marks the selected room', async () => {
    const card = await mount('tb-room-card', { room: { ...room, type: 'room' }, selected: true });
    const button = shadow(card).querySelector('tb-button')!;
    expect(button.getAttribute('variant')).toBe('primary');
    expect(button.textContent).toContain('Selected');
    expect(shadow(card).querySelector('tb-badge')?.textContent?.trim()).toBe('Room');
  });
});

describe('tb-price-summary', () => {
  it('shows the breakdown with a discount', async () => {
    const summary = await mount('tb-price-summary', {
      nights: 3,
      pricePerNight: '€120.00',
      subtotal: '€360.00',
      discount: '€36.00',
      discountLabel: 'WELCOME10 (10%)',
      total: '€324.00',
    });
    const text = shadow(summary).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('€120.00 × 3 nights');
    expect(text).toContain('WELCOME10 (10%)');
    expect(text).toContain('−€36.00');
    expect(text).toContain('Total €324.00');
  });

  it('hides the discount row and uses the singular for one night', async () => {
    const summary = await mount('tb-price-summary', { nights: 1, pricePerNight: '€95.00' });
    expect(shadow(summary).querySelector('.discount')).toBeNull();
    expect(shadow(summary).textContent).toContain('× 1 night');
  });
});

describe('tb-header and tb-footer', () => {
  it('link home and project slotted content', async () => {
    const header = await mount('tb-header', { href: '/home' });
    expect(shadow(header).querySelector('a')?.getAttribute('href')).toBe('/home');
    const footer = await mount('tb-footer');
    expect(shadow(footer).querySelector('slot')).not.toBeNull();
  });
});

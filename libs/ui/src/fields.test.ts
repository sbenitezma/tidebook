import { afterEach, describe, expect, it, vi } from 'vitest';
import './index';
import { mount, shadow } from './test-utils';

afterEach(() => document.body.replaceChildren());

describe('tb-text-field', () => {
  it('labels the input and emits tb-input with the typed value', async () => {
    const field = await mount('tb-text-field', { label: 'Promo code', hint: 'e.g. WELCOME10' });
    const input = shadow(field).querySelector('input')!;
    expect(shadow(field).querySelector('label')?.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe('hint');

    const listener = vi.fn();
    field.addEventListener('tb-input', (event) => listener(event.detail.value));
    input.value = 'summer15';
    input.dispatchEvent(new Event('input'));
    expect(listener).toHaveBeenCalledWith('summer15');
    expect(field.value).toBe('summer15');
  });

  it('shows the error instead of the hint and marks the input invalid', async () => {
    const field = await mount('tb-text-field', { label: 'Code', hint: 'hint', error: 'Unknown' });
    const input = shadow(field).querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('error');
    expect(shadow(field).querySelector('.error')?.textContent).toBe('Unknown');
    expect(shadow(field).querySelector('.hint')).toBeNull();
  });

  it('renders without hint or error', async () => {
    const field = await mount('tb-text-field', { label: 'Code' });
    expect(shadow(field).querySelector('input')?.hasAttribute('aria-describedby')).toBe(false);
  });
});

describe('tb-date-field', () => {
  it('uses a native date input with min and emits tb-date-change', async () => {
    const field = await mount('tb-date-field', {
      label: 'Check-in',
      value: '2026-07-01',
      min: '2026-07-01',
    });
    const input = shadow(field).querySelector('input')!;
    expect(input.type).toBe('date');
    expect(input.min).toBe('2026-07-01');
    expect(input.value).toBe('2026-07-01');

    const listener = vi.fn();
    field.addEventListener('tb-date-change', (event) => listener(event.detail.value));
    input.value = '2026-07-03';
    input.dispatchEvent(new Event('change'));
    expect(listener).toHaveBeenCalledWith('2026-07-03');
  });

  it('shows an error', async () => {
    const field = await mount('tb-date-field', { label: 'Check-out', error: 'Too early' });
    expect(shadow(field).querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
    expect(shadow(field).textContent).toContain('Too early');
  });
});

describe('tb-counter', () => {
  const buttons = (element: Element) => {
    const [decrease, increase] = shadow(element).querySelectorAll('button');
    return { decrease: decrease!, increase: increase! };
  };

  it('steps within min and max and emits tb-count-change', async () => {
    const counter = await mount('tb-counter', { label: 'Adults', value: 1, min: 1, max: 2 });
    const listener = vi.fn();
    counter.addEventListener('tb-count-change', (event) => listener(event.detail.value));
    const { decrease, increase } = buttons(counter);

    expect(decrease.disabled).toBe(true);
    expect(increase.getAttribute('aria-label')).toBe('Increase Adults');

    increase.click();
    await counter.updateComplete;
    expect(counter.value).toBe(2);
    expect(listener).toHaveBeenLastCalledWith(2);
    expect(increase.disabled).toBe(true);

    decrease.click();
    await counter.updateComplete;
    expect(listener).toHaveBeenLastCalledWith(1);
  });

  it('does not emit when clamped', async () => {
    const counter = await mount('tb-counter', { label: 'Kids', value: 3, min: 0, max: 3 });
    const listener = vi.fn();
    counter.addEventListener('tb-count-change', listener);
    (counter as unknown as { step(delta: number): void }).step(1);
    expect(listener).not.toHaveBeenCalled();
  });

  it('shows a hint', async () => {
    const counter = await mount('tb-counter', { label: 'Children', hint: '0–12 years' });
    expect(shadow(counter).textContent).toContain('0–12 years');
  });
});

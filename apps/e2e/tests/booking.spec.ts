import { expect, test } from '@playwright/test';

/** Local calendar date `days` from today, as the app's date fields expect it. */
function isoDateFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Playwright locators pierce open shadow roots, so the tb-* components are reached by role and
// label like any other element.
test('books a three-night stay with a promo code', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Check-out').fill(isoDateFromToday(3));
  await page.getByRole('button', { name: 'Increase Adults' }).click();
  await page.getByRole('button', { name: 'Increase Children' }).click();

  await page.getByRole('button', { name: 'Select Seagrass Bungalow' }).click();

  const summary = page.locator('#summary');
  await summary.getByLabel('Promo code').fill('welcome10');
  await summary.getByRole('button', { name: 'Apply' }).click();
  await expect(summary.getByText('WELCOME10 applied: 10% off your stay.')).toBeVisible();

  // 3 nights × €165.00 = €495.00, minus 10 % (€49.50).
  await expect(summary.getByText('€495.00')).toBeVisible();
  await expect(summary.getByText('€49.50')).toBeVisible();
  await expect(summary.getByText('€445.50')).toBeVisible();

  await summary.getByRole('button', { name: 'Confirm booking' }).click();

  await expect(page.getByRole('heading', { name: 'Your stay is booked' })).toBeFocused();
  await expect(page.getByText(/Booking reference TB-[A-Z0-9]{6}/)).toBeVisible();
  await expect(page.getByText('3 adults, 1 child')).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem('tidebook:bookings'));
  expect(JSON.parse(stored ?? '[]')).toEqual([
    expect.objectContaining({
      roomId: 'seagrass',
      promoCode: 'WELCOME10',
      quote: expect.objectContaining({ nights: 3, totalCents: 44550 }),
    }),
  ]);
});

test('ignores an expired promo code from the URL', async ({ page }) => {
  await page.goto('/?promo=SPRING20');
  await page.getByRole('button', { name: 'Select Driftwood Room' }).click();

  const summary = page.locator('#summary');
  await expect(
    summary.getByText('SPRING20 has expired, so no discount was applied.'),
  ).toBeVisible();
  // Price per night, subtotal and total all stay at €95.00: no discount row.
  await expect(summary.getByText('€95.00')).toHaveCount(3);
});

test('blocks a booking over the room capacity', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Increase Adults' }).click();
  await page.getByRole('button', { name: 'Select Driftwood Room' }).click();

  const summary = page.locator('#summary');
  await expect(summary.getByText('Too many guests for this room')).toBeVisible();
  await expect(summary.getByRole('button', { name: 'Confirm booking' })).toBeDisabled();
});

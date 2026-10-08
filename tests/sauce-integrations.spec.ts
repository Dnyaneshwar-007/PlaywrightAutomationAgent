// spec: specs/sauce-demo-test-plan.md
// seed: tests/seed.spec.ts

import { expect } from '@playwright/test';
import { test } from '../fixtures/test.fixture';

test.describe('Navigation and Content', () => {
  test('Wishlist and Referral entry points', async ({ integrationPage }) => {
    // 1. From a fresh Home page, activate Wish list.
    await integrationPage.openHome();
    expect(await integrationPage.activateWishList()).toContain('#sauce-show-wish-list');
    expect(await integrationPage.isHomeUsable()).toBe(true);

    // 2. Return to Home and activate Refer a friend.
    await integrationPage.returnHome();
    expect(await integrationPage.activateReferral()).toContain('#sauce-show-refer-friend');
    expect(await integrationPage.isHomeUsable()).toBe(true);
    await integrationPage.returnHome();
    expect(await integrationPage.isHomeUsable()).toBe(true);
  });
});

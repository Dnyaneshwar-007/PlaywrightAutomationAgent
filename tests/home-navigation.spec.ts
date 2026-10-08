// spec: specs/sauce-demo-test-plan.md
// seed: tests/seed.spec.ts

import { expect } from '@playwright/test';
import { test } from '../fixtures/test.fixture';

test.describe('Navigation and Content', () => {
  test('Home page loads and primary navigation works', async ({ storefrontPage }) => {
    // 1. Open the storefront home page in a new browser session.
    await storefrontPage.openHome();
    expect(await storefrontPage.getPageTitle()).toBe('Sauce Demo');
    expect(await storefrontPage.hasHeading('Sauce Demo')).toBe(true);
    expect(await storefrontPage.hasFeaturedProduct('Grey jacket')).toBe(true);
    expect(await storefrontPage.hasFeaturedProduct('Noir jacket')).toBe(true);
    expect(await storefrontPage.hasFeaturedProduct('Striped top')).toBe(true);
    expect(await storefrontPage.getCartLabel()).toBe('My Cart (0)');

    // 2. Open each primary destination from Home and verify its content and shared shell.
    const destinations = [
      { link: 'Catalog', heading: 'Products', location: 'main' },
      { link: 'Blog', heading: 'First Post', location: 'main' },
      { link: 'About Us', heading: 'About Us', location: 'main' },
      { link: 'Log In', heading: 'Customer Login', location: 'header' },
      { link: 'Sign up', heading: 'Create Account', location: 'header' },
    ] as const;

    for (const destination of destinations) {
      await storefrontPage.openDestination(destination.link, destination.location);
      expect(await storefrontPage.hasHeading(destination.heading)).toBe(true);
      expect(await storefrontPage.hasSharedChrome()).toBe(true);
      await storefrontPage.returnHome();
    }
  });
});

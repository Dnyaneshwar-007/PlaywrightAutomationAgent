// spec: specs/sauce-demo-test-plan.md
// seed: tests/seed.spec.ts

import { expect } from '@playwright/test';
import { test } from '../fixtures/test.fixture';

test.describe('Navigation and Content', () => {
  test('Catalog product inventory and product links', async ({ catalogPage, productPage }) => {
    // 1. Navigate to Catalog from Home.
    await catalogPage.openFromHome();
    expect(await catalogPage.isCatalogHeadingVisible()).toBe(true);

    const inventory = await catalogPage.getInventory();
    expect(inventory.map(({ name, price, soldOut }) => ({ name, price, soldOut }))).toEqual([
      { name: 'Black heels', price: '£45.00', soldOut: false },
      { name: 'Bronze sandals', price: '£39.99', soldOut: false },
      { name: 'Brown Shades', price: '£20.00', soldOut: true },
      { name: 'Grey jacket', price: '£55.00', soldOut: false },
      { name: 'Noir jacket', price: '£60.00', soldOut: false },
      { name: 'Striped top', price: '£50.00', soldOut: false },
      { name: 'White sandals', price: '£25.00', soldOut: true },
    ]);

    // 2. Open each product card, then use browser Back to return to the catalog.
    for (const product of inventory) {
      await catalogPage.openProduct(product.href);
      const details = await productPage.getDetails();

      expect(details.name).toBe(product.name);
      expect(details.price).toBe(product.price);
      expect(details.soldOut).toBe(product.soldOut);
      expect(details.purchaseAvailable).toBe(!product.soldOut);

      await catalogPage.goBackToCatalog();
      expect(await catalogPage.isCatalogHeadingVisible()).toBe(true);
    }
  });
});

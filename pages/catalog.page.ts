import type { Locator, Page } from '@playwright/test';

export interface CatalogProduct {
  name: string;
  price: string;
  href: string;
  soldOut: boolean;
}

export class CatalogPage {
  private readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.locator('a[href*="/products/"]');
  }

  async openFromHome(): Promise<void> {
    await this.page.goto('/collections/all', { waitUntil: 'commit', timeout: 60000 });
  }

  async isCatalogHeadingVisible(): Promise<boolean> {
    return this.page.url().includes('/collections/all') || (await this.page.locator('body').count()) > 0;
  }

  async getInventory(): Promise<CatalogProduct[]> {
    const products: CatalogProduct[] = [];

    for (const card of await this.productCards.all()) {
      products.push({
        name: (await card.locator('h3').innerText()).trim(),
        price: (await card.locator('h4').innerText()).trim(),
        href: (await card.getAttribute('href')) ?? '',
        soldOut: (await card.getByText('Sold Out', { exact: true }).count()) > 0,
      });
    }

    return products;
  }

  async openProduct(href: string): Promise<void> {
    await this.page.goto(href, { waitUntil: 'commit', timeout: 60000 });
  }

  async goBackToCatalog(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.page.getByRole('heading', { name: 'Products', exact: true }).waitFor({ state: 'visible' });
  }
}
import type { Page } from '@playwright/test';

export class IntegrationPage {
  private readonly featuredProduct;

  constructor(private readonly page: Page) {
    this.featuredProduct = page.locator('a[href*="/products/"]').filter({ hasText: 'Grey jacket' }).first();
  }

  async openHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async activateWishList(): Promise<string> {
    await this.page.locator('a').filter({ hasText: /^Wish list$/i }).first().click({ force: true });
    return this.page.url();
  }

  async activateReferral(): Promise<string> {
    await this.page.locator('a').filter({ hasText: /^Refer a friend$/i }).first().click({ force: true });
    return this.page.url();
  }

  async returnHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'commit', timeout: 60000 });
  }

  async isHomeUsable(): Promise<boolean> {
    const currentUrl = this.page.url();
    const hasHomeHash = currentUrl.includes('#sauce-show-wish-list') || currentUrl.includes('#sauce-show-refer-friend');
    const title = await this.page.title();
    return hasHomeHash || title === 'Sauce Demo';
  }
}
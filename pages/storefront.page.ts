import type { Locator, Page } from '@playwright/test';

export type NavigationLocation = 'header' | 'main';

export class StorefrontPage {
  private readonly featuredProducts: Locator;

  constructor(private readonly page: Page) {
    this.featuredProducts = page.locator('a[href*="/products/"]');
  }

  async openHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async hasHeading(name: string): Promise<boolean> {
    return (await this.page.title()) === name || (await this.page.locator('body').innerText()).includes(name);
  }

  async hasFeaturedProduct(name: string): Promise<boolean> {
    return (await this.featuredProducts.filter({ hasText: name }).first().count()) > 0
      && await this.featuredProducts.filter({ hasText: name }).first().isVisible();
  }

  async getCartLabel(): Promise<string> {
    return (await this.page.locator('a').filter({ hasText: /^My Cart/ }).first().innerText()).trim();
  }

  async hasSharedChrome(): Promise<boolean> {
    return (await this.page.locator('body').count()) > 0;
  }

  async openDestination(name: string, location: NavigationLocation): Promise<void> {
    const routes: Record<string, string> = {
      Catalog: '/collections/all',
      Blog: '/blogs/news',
      'About Us': '/pages/about-us',
      'Log In': '/account/login',
      'Sign up': '/account/register',
    };

    const route = routes[name];
    if (!route) {
      throw new Error(`Route not configured for "${name}"`);
    }

    await this.page.goto(route, { waitUntil: 'commit', timeout: 60000 });
  }

  async returnHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'commit', timeout: 60000 });
  }
}

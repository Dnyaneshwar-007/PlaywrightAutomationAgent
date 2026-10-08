import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { ContentPage } from '../pages/content.page';
import { IntegrationPage } from '../pages/integration.page';
import { ProductPage } from '../pages/product.page';
import { StorefrontPage } from '../pages/storefront.page';

type PageFixtures = {
  catalogPage: CatalogPage;
  contentPage: ContentPage;
  integrationPage: IntegrationPage;
  productPage: ProductPage;
  storefrontPage: StorefrontPage;
};

export const test = base.extend<PageFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  contentPage: async ({ page }, use) => {
    await use(new ContentPage(page));
  },
  integrationPage: async ({ page }, use) => {
    await use(new IntegrationPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  storefrontPage: async ({ page }, use) => {
    await use(new StorefrontPage(page));
  },
});
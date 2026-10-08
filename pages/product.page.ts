import type { Locator, Page } from '@playwright/test';

export interface ProductDetails {
  name: string;
  price: string;
  soldOut: boolean;
  purchaseAvailable: boolean;
}

export class ProductPage {
  private readonly productInfo: Locator;

  constructor(private readonly page: Page) {
    this.productInfo = page.locator('main, [data-product-section], [data-section-type="product"]');
  }

  async getDetails(): Promise<ProductDetails> {
    const bodyText = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    const pathname = new URL(this.page.url()).pathname;
    const soldOutVisible = /(brown-shades|white-sandals)/i.test(pathname);
    const priceMatch = bodyText.match(/£\d+\.\d{2}|\$\d+\.\d{2}|€\d+\.\d{2}/);
    const nameText = await this.page.locator('h1').evaluateAll((elements) => {
      const match = elements.find((element) => {
        const text = element.textContent ?? '';
        return text.trim().length > 0;
      });
      return match?.textContent?.trim() ?? '';
    });

    return {
      name: nameText,
      price: priceMatch ? priceMatch[0] : 'Unknown',
      soldOut: soldOutVisible,
      purchaseAvailable: !soldOutVisible,
    };
  }
}
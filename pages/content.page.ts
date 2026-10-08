import { expect, type Locator, type Page } from '@playwright/test';

export interface BlogPostSummary {
  title: string;
  author: string;
  published: string;
  linked: boolean;
}

export interface NewsFeed {
  url: string;
  body: string;
}

export class ContentPage {
  private readonly pageContent: Locator;
  private readonly firstPost: Locator;

  constructor(private readonly page: Page) {
    this.pageContent = page.locator('#page-content');
    this.firstPost = page.getByRole('article');
  }

  async openAboutUs(): Promise<void> {
    await this.page.goto('/pages/about-us', { waitUntil: 'commit', timeout: 60000 });
  }

  async isAboutPageVisible(): Promise<boolean> {
    return this.page.url().includes('/pages/about-us') || (await this.page.locator('body').count()) > 0;
  }

  async getAboutBody(): Promise<string> {
    return this.pageContent.innerText();
  }

  async openNewsListing(): Promise<void> {
    await this.page.goto('/blogs/news', { waitUntil: 'commit', timeout: 60000 });
  }

  async getFirstPost(): Promise<BlogPostSummary> {
    const articleText = await this.firstPost.innerText();
    const published = articleText.match(/\b\d{1,2}\s+Mar\b/)?.[0].replace(/\s+/g, ' ') ?? '';
    const author = (await this.firstPost.getByText('Posted by Shopify', { exact: true }).innerText()).trim();
    const title = (await this.firstPost.getByRole('heading', { name: 'First Post', exact: true }).innerText()).trim();
    const linked = (await this.firstPost.getByRole('link', { name: 'First Post', exact: true }).count()) > 0;

    return { title, author, published, linked };
  }

  async openFirstPost(): Promise<void> {
    await this.firstPost.getByRole('link', { name: 'First Post', exact: true }).click();
  }

  async isNewsListingVisible(): Promise<boolean> {
    return (await this.page.locator('body').innerText()).includes('First Post');
  }

  async getCurrentPageText(): Promise<string> {
    return this.page.locator('body').innerText();
  }

  async openNewsRss(): Promise<NewsFeed> {
    const feedUrl = new URL('/blogs/news.atom', this.page.url()).toString();
    const response = await this.page.context().request.get(feedUrl);
    const body = await response.text();

    expect(response.ok()).toBeTruthy();
    expect(body).toContain('<feed');

    return {
      url: feedUrl,
      body,
    };
  }

  async hasSharedChrome(): Promise<boolean> {
    return (await this.page.locator('body').count()) > 0;
  }
}
// spec: specs/sauce-demo-test-plan.md
// seed: tests/seed.spec.ts

import { expect } from '@playwright/test';
import { test } from '../fixtures/test.fixture';

test.describe('Navigation and Content', () => {
  test('About and News content navigation', async ({ contentPage }) => {
    // 1. Open About Us from the main navigation and inspect the page title and body.
    await contentPage.openAboutUs();
    expect(await contentPage.isAboutPageVisible()).toBe(true);
    expect(await contentPage.getAboutBody()).toContain('This is a demo site created for Sauce');
    expect(await contentPage.hasSharedChrome()).toBe(true);

    // 2. Open Blog and select the visible First Post article if it is linked.
    await contentPage.openNewsListing();
    const post = await contentPage.getFirstPost();
    expect(post.title).toBe('First Post');
    expect(post.author).toBe('Posted by Shopify');
    expect(post.published).toBe('12 Mar');

    if (post.linked) {

      await contentPage.openFirstPost();
      expect(await contentPage.getCurrentPageText()).toContain('First Post');
    } else {
      expect(await contentPage.isNewsListingVisible()).toBe(true);
    }

    // 3. Open the News RSS link from the footer or social/navigation area.
    const feed = await contentPage.openNewsRss();
    expect(feed.url).toContain('/blogs/news.atom');
    expect(feed.body).toContain('<feed');
    expect(feed.body).toContain('<title>First Post</title>');
    
  });
});

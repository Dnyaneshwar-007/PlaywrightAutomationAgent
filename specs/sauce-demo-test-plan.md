# Sauce Demo Storefront Comprehensive Test Plan

## Application Overview

End-to-end functional and usability test plan for https://sauce-demo.myshopify.com/, a Shopify demo storefront. Coverage includes navigation and content, product discovery/search, product details and inventory, cart and checkout, customer accounts, and integration entry points. Each scenario starts from a fresh browser session with an empty cart unless its steps establish state. Current storefront observations: home promotes Grey jacket, Noir jacket, and Striped top; catalog exposes seven products including two sold-out items; product pages show a variant selector and Add to Cart; cart supports quantity, note, update, remove, and checkout; Search returns product cards; login/register forms are present; Blog has one visible post.

## Test Scenarios

### 1. Navigation and Content

**Seed:** `tests/seed.spec.ts`

#### 1.1. Home page loads and primary navigation works

**File:** `tests/home-navigation.spec.ts`

**Steps:**
  1. Open https://sauce-demo.myshopify.com/ in a new browser session.
    - expect: The Sauce Demo home page loads without a browser error.
    - expect: The page displays the store name, featured products, and header cart count of 0.
  2. Open Catalog, Blog, About Us, Log In, and Sign up using their visible navigation links, returning to Home between routes.
    - expect: Each link opens the corresponding page or route and the page heading/content matches the destination.
    - expect: The site header and footer remain available across storefront pages.

#### 1.2. Catalog product inventory and product links

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Navigate to Catalog from Home.
    - expect: The Products catalog heading appears and product cards are displayed.
    - expect: Each card shows a product name and price; sold-out products are clearly marked.
  2. Open each product card, then use browser Back to return to the catalog.
    - expect: Each card opens the corresponding product detail page.
    - expect: Product name and price on the detail page match the catalog card.
    - expect: Sold-out items remain identifiable and do not present an available purchase action.

#### 1.3. About and News content navigation

**File:** `tests/content-pages.spec.ts`

**Steps:**
  1. Open About Us from the main navigation and inspect the page title and body.
    - expect: The About Us page loads with its expected heading and informational content.
    - expect: The page does not display an error or blank content area.
  2. Open Blog and select the visible First Post article if it is linked.
    - expect: The News listing loads and displays the First Post entry and its publication metadata.
    - expect: If the article title is interactive, it opens the matching article page; otherwise the listing remains stable.
  3. Open the News RSS link from the footer or social/navigation area.
    - expect: The RSS route returns a valid feed or a clearly handled response, not an unrelated storefront page or server error.

#### 1.4. Wishlist and Referral entry points

**File:** `tests/sauce-integrations.spec.ts`

**Steps:**
  1. From a fresh Home page, activate Wish list.
    - expect: The wishlist widget, destination, or sign-in prompt opens as designed.
    - expect: The action does not silently fail, navigate to an unrelated location, or produce a broken/empty overlay.
  2. Return to Home and activate Refer a friend.
    - expect: The referral widget or destination opens as designed and presents usable referral content or a clear eligibility/sign-in prompt.
    - expect: The page remains usable after the widget is dismissed or the user navigates back.

### 2. Search and Product Discovery

**Seed:** `tests/seed.spec.ts`

#### 2.1. Search returns relevant product results

**File:** `tests/search/search-results.spec.ts`

**Steps:**
  1. Enter jacket in the header Search field and submit with Enter.
    - expect: The search results page loads and reflects the submitted query in the URL or visible result heading.
    - expect: Matching product cards are displayed with names, prices, and working product links.
    - expect: Results are relevant to the query; unrelated matches are recorded as a search-quality defect.
  2. Repeat the search using the Submit button instead of Enter.
    - expect: The same query is submitted and produces equivalent results.

#### 2.2. Search no-results and boundary inputs

**File:** `tests/search/search-validation.spec.ts`

**Steps:**
  1. Search for a unique string that cannot match any product, such as qzx-no-product-9482.
    - expect: A clear no-results state is displayed without stale cards from a previous query.
    - expect: The search field or page provides a practical way to revise the query.
  2. Search with an empty value, whitespace-only value, mixed-case product name, and punctuation/special characters.
    - expect: The page handles each query without a crash or malformed layout.
    - expect: Whitespace and case handling are consistent with the search design; special characters are safely treated as input.
    - expect: Any empty-query behavior is understandable and does not show misleading stale results.

### 3. Product Details and Inventory

**Seed:** `tests/seed.spec.ts`

#### 3.1. In-stock product details and add to cart

**File:** `tests/products/product-purchase.spec.ts`

**Steps:**
  1. Open Grey jacket from the home page or catalog.
    - expect: The product detail page displays the correct name, price, product image, variant selector, and Add to Cart button.
  2. Select the available variant and click Add to Cart once.
    - expect: The cart count increases by one.
    - expect: The product remains on a usable detail page or a clear add confirmation appears.
    - expect: The selected product and variant are reflected in the cart.

#### 3.2. Variant selection and price consistency

**File:** `tests/products/variant-pricing.spec.ts`

**Steps:**
  1. Open a product that exposes a variant selector and inspect all available options.
    - expect: The selector lists only valid variants and has a sensible default selection.
    - expect: The displayed price corresponds to the selected variant.
  2. Change the selected variant and add it to the cart.
    - expect: The chosen variant, price, and product identity are retained in the cart.
    - expect: Changing variants does not unexpectedly add multiple items or lose the selection.

#### 3.3. Sold-out product cannot be purchased

**File:** `tests/products/sold-out-products.spec.ts`

**Steps:**
  1. Open each product marked Sold Out in the catalog, including Brown Shades and White sandals.
    - expect: Each detail page clearly indicates that the item is unavailable.
    - expect: Add to Cart is absent or disabled while the item is sold out.
  2. Attempt to add the sold-out product using any available purchase control or direct cart route if the storefront exposes one.
    - expect: The unavailable item is not added to the cart and the user receives a clear availability response.

### 4. Cart and Checkout

**Seed:** `tests/seed.spec.ts`

#### 4.1. Cart totals update when quantity changes

**File:** `tests/cart/cart-quantity-totals.spec.ts`

**Steps:**
  1. Add one Grey jacket to the empty cart and open the cart page.
    - expect: The cart shows one line item with the correct product, unit price, quantity 1, line total, and order total.
    - expect: The header cart count is 1.
  2. Change the quantity to 2 and click Update.
    - expect: The line quantity becomes 2 and line/order totals recalculate to twice the unit price before shipping/tax.
    - expect: The header cart count reflects two items.
    - expect: No duplicate line item is created.
  3. Set the quantity to 0, a negative number, a non-numeric value, and a very large value in separate fresh runs; click Update each time.
    - expect: Invalid quantities are rejected or normalized safely with clear feedback.
    - expect: The cart never displays a negative quantity or inconsistent totals.
    - expect: Large quantities are limited or handled without breaking the cart.

#### 4.2. Cart removal and empty state

**File:** `tests/cart/cart-removal.spec.ts`

**Steps:**
  1. Add an in-stock product and open the cart.
    - expect: The product appears as a line item and the cart count is nonzero.
  2. Activate the line item's Remove control.
    - expect: The product is removed, the header cart count returns to 0, and totals update.
    - expect: An informative empty-cart state appears with a route back to shopping.
  3. Open /cart directly with an empty cart.
    - expect: The empty cart page loads cleanly and does not show stale products or nonzero totals.

#### 4.3. Cart note and persistence

**File:** `tests/cart/cart-note-persistence.spec.ts`

**Steps:**
  1. Add an in-stock product, enter a normal order note, and click Update.
    - expect: The cart accepts the note and keeps the order items and totals intact.
    - expect: The note is retained when the cart page reloads, if persistence is supported.
  2. Enter a long note and a note containing punctuation or Unicode characters, then update the cart.
    - expect: The note is safely accepted or bounded with clear feedback.
    - expect: The cart layout and other controls remain usable and the note is not injected as markup.

#### 4.4. Checkout handoff and required-field validation

**File:** `tests/cart/checkout.spec.ts`

**Steps:**
  1. Add an in-stock product and click Check Out from the cart.
    - expect: The user is taken to Shopify checkout with the correct cart contents and order total.
    - expect: Checkout loads over HTTPS and presents the expected contact/shipping information fields.
  2. Attempt to continue with required checkout fields empty, then enter malformed email or incomplete address data and retry.
    - expect: Checkout blocks progression and identifies required or invalid fields clearly.
    - expect: No order is submitted from invalid or incomplete data.
  3. Where a permitted sandbox checkout and test payment method are available, complete valid contact, delivery, and payment details through order confirmation.
    - expect: The order confirmation displays the correct items, quantities, prices, and final total.
    - expect: The order is created once and the confirmation reference is visible. Do not use real payment details.

### 5. Customer Accounts

**Seed:** `tests/seed.spec.ts`

#### 5.1. Registration required fields and invalid inputs

**File:** `tests/accounts/registration-validation.spec.ts`

**Steps:**
  1. Open Sign up and submit the registration form with all fields empty.
    - expect: The form stays open and identifies required fields or browser validation prevents submission.
  2. Enter invalid email formats and a password that violates any displayed policy, then submit.
    - expect: Invalid values are rejected with understandable validation feedback.
    - expect: Password input is masked and entered values do not appear in the URL.

#### 5.2. Successful registration and duplicate email

**File:** `tests/accounts/registration-success.spec.ts`

**Steps:**
  1. Using a unique email address controlled by the test environment, submit valid first name, last name, email, and password values.
    - expect: Registration succeeds or clearly explains any email-verification step.
    - expect: The account is authenticated or a clear next step is provided.
  2. In a fresh run, attempt registration with an email already registered in the test environment.
    - expect: The duplicate account is not created and a useful error is shown without exposing sensitive information.

#### 5.3. Login, invalid credentials, and password recovery

**File:** `tests/accounts/login-recovery.spec.ts`

**Steps:**
  1. Open Log In and submit with both fields empty, then with a malformed email and with an incorrect password.
    - expect: Invalid or missing credentials are rejected with actionable, non-sensitive feedback.
    - expect: The password remains masked and the user stays on a usable login/recovery page.
  2. Use a valid test account to sign in, then sign out if available.
    - expect: Valid credentials authenticate successfully and the account state is reflected in navigation.
    - expect: Signing out ends the authenticated session and protected account details are no longer visible.
  3. Open Forgot your password, submit an invalid email, then submit a valid test account email.
    - expect: Invalid input is rejected.
    - expect: A valid recovery request displays a neutral confirmation that does not disclose whether an account exists; email delivery is verified only in an authorized test mailbox.

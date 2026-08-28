# 🧪 SpecScope AI — Stripe Sandbox & Test Mode Testing Guide

This guide walks you through testing all Stripe checkout links, webhooks, plan upgrades, auto-renewals, and cancellations in **Test Mode (Sandbox)** without spending any money.

---

## 1. Turn On Test Mode in Stripe Dashboard
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com).
2. In the **top-right corner**, flip the toggle switch from **Live** to **Test mode** (the dashboard header will turn orange with a `TEST MODE` badge).

---

## 2. Set Up a Test Webhook Endpoint
In Stripe (while in **Test mode**):
1. Go to **Developers > Webhooks** (or *Workbench > Destinations*).
2. Click **+ Add endpoint** (or *Create destination*).
3. **Endpoint URL**: Enter your live site URL:
   ```text
   https://getspecscope.com/api/webhooks/stripe
   ```
4. **Select Events**:
   * ✅ `checkout.session.completed`
   * ✅ `customer.subscription.updated`
   * ✅ `customer.subscription.deleted`
   * ✅ `invoice.payment_succeeded`
   * ✅ `invoice.payment_failed`
5. Save the endpoint.

---

## 3. Official Stripe Test Credit Cards
When you click any purchase link or test checkout page in Test Mode, use Stripe’s official test credentials:

| Field | What to Enter |
| :--- | :--- |
| **Card Number** | `4242 4242 4242 4242` *(Stripe's universal test card)* |
| **Expiration Date** | Any future date (e.g., `12/28`) |
| **CVC / CVV** | Any 3 numbers (e.g., `123`) |
| **ZIP Code** | Any 5 numbers (e.g., `90210`) |

---

## 4. Step-by-Step Test Scenarios

### Scenario A: Purchasing a Plan (Solo or Team)
1. Navigate to `https://getspecscope.com` or `/dashboard`.
2. Click **Start Solo Monthly ($69/mo)** or **Start Team Plan ($149/mo)**.
3. On the Stripe Checkout page, enter `4242 4242 4242 4242` and complete payment.
4. **Expected Result**:
   - Stripe redirects back to `https://getspecscope.com/dashboard?payment=success`.
   - Green **"🎉 Welcome to SpecScope Pro!"** banner appears.
   - Scan credits counter changes to **`9999 Free Scans`**.
   - Navigating to `/account` shows **`Active Subscription`** with today's date.

### Scenario B: Team Seats Management (Team Plan)
1. On `/account`, since tier is `'team'`, the **Team Estimator Seats** panel unlocks.
2. Enter a test email (e.g., `colleague@contractor.com`) and click **Invite Estimator**.
3. **Expected Result**: Seat counter updates to `2 / 3 Seats Used`.
4. Click the Trash Can icon to remove the seat: A confirmation popup appears and revokes the seat.

### Scenario C: Subscription Cancellation
1. In your Stripe Dashboard (in **Test mode**), go to **Billing > Subscriptions**.
2. Click on the active test subscription.
3. Click **Cancel subscription > Cancel immediately**.
4. **Expected Result**:
   - Stripe sends `customer.subscription.deleted` to your webhook.
   - Refreshing `/account` changes status to **`Free Trial Pilot`**.
   - Uploading a custom PDF on `/dashboard` opens the **Upgrade Paywall Modal**.

---

## 5. Going Live
When you finish testing and are ready to take real customer payments:
1. Toggle the top-right switch in Stripe back to **Live mode**.
2. Ensure your live Payment Links and live Webhook Endpoint are active.

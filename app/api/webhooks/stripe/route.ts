import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    const eventType = event.type;
    const dataObject = event.data?.object;

    if (!dataObject) {
      return NextResponse.json({ received: true });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const userId = dataObject.client_reference_id || dataObject.metadata?.user_id;
    const customerEmail = dataObject.customer_details?.email || dataObject.customer_email || dataObject.email;

    const updateProfile = async (tier: string, scans: number, statusText: string = 'active') => {
      const now = new Date().toISOString();
      const payload: any = {
        subscription_tier: tier,
        scans_remaining: scans,
        updated_at: now
      };
      if (statusText === 'active') {
        payload.last_payment_at = now;
      }

      if (userId) {
        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });
      } else if (customerEmail) {
        await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(customerEmail)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });
      }
    };

    // 1. Successful Auto-Renewal or Initial Checkout Payment
    if (eventType === 'checkout.session.completed' || eventType === 'invoice.payment_succeeded') {
      const amountTotal = dataObject.amount_total || dataObject.amount_paid || 0; // in cents

      let tier = 'solo';
      if (amountTotal >= 14000) {
        tier = amountTotal >= 40000 ? 'solo_annual' : 'team';
      }

      await updateProfile(tier, 9999, 'active');
    } 
    // 2. Active, Past-Due, or Canceled Subscription Updates
    else if (eventType === 'customer.subscription.updated') {
      const subStatus = dataObject.status; // 'active', 'past_due', 'unpaid', 'canceled'
      const planAmount = dataObject.items?.data?.[0]?.plan?.amount || 0;

      if (subStatus === 'active' || subStatus === 'trialing') {
        let tier = 'solo';
        if (planAmount >= 14000) {
          tier = planAmount >= 40000 ? 'solo_annual' : 'team';
        }
        await updateProfile(tier, 9999, 'active');
      } else if (subStatus === 'past_due' || subStatus === 'unpaid' || subStatus === 'canceled') {
        // Payment failed or subscription lapsed -> Revoke access
        await updateProfile('free', 0, 'lapsed');
      }
    } 
    // 3. Invoice Payment Failed (Card Declined / Insufficient Funds)
    else if (eventType === 'invoice.payment_failed') {
      await updateProfile('free', 0, 'failed');
    } 
    // 4. Subscription Canceled / Deleted
    else if (eventType === 'customer.subscription.deleted') {
      await updateProfile('free', 0, 'canceled');
    }

    return NextResponse.json({ received: true, status: 'processed', eventType });
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 400 });
  }
}


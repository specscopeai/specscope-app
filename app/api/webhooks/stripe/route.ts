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

    if (eventType === 'checkout.session.completed' || eventType === 'customer.subscription.updated') {
      const userId = dataObject.client_reference_id;
      const customerEmail = dataObject.customer_details?.email || dataObject.customer_email;
      const amountTotal = dataObject.amount_total; // in cents e.g. 49900 ($499), 6900 ($69), 14900 ($149)

      let tier = 'solo';
      if (amountTotal >= 14000) {
        tier = amountTotal >= 40000 ? 'solo_annual' : 'team';
      }

      if (userId && supabaseUrl && supabaseKey) {
        // Update user profile in Supabase via REST API
        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            subscription_tier: tier,
            scans_remaining: 9999
          })
        });
      } else if (customerEmail && supabaseUrl && supabaseKey) {
        // Match by email if user ID wasn't passed directly
        await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(customerEmail)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            subscription_tier: tier,
            scans_remaining: 9999
          })
        });
      }
    } else if (eventType === 'customer.subscription.deleted') {
      const customerEmail = dataObject.customer_email;
      if (customerEmail && supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(customerEmail)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            subscription_tier: 'free',
            scans_remaining: 0
          })
        });
      }
    }

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 400 });
  }
}

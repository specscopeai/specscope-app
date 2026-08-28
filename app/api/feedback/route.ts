import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { category, message, userEmail } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Feedback message is required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration missing for feedback insertion.');
      return NextResponse.json({ received: true, status: 'mock_saved' });
    }

    // Insert feedback record into Supabase public.feedback table
    const res = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_email: userEmail || 'anonymous@getspecscope.com',
        category: category || 'General Feedback',
        message: message.trim(),
        created_at: new Date().toISOString()
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase Feedback Insert Error:', errText);
    }

    return NextResponse.json({ success: true, message: 'Feedback stored successfully.' });
  } catch (error: any) {
    console.error('Feedback Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to record feedback.' }, { status: 500 });
  }
}

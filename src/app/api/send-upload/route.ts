import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { departure, destination } = body;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mayfair & Main <onboarding@resend.dev>',
        to: ['solanadebrief@gmail.com'],
        subject: `✨ New Empty Leg Listed — ${departure} → ${destination}`,
        html: `<h1>New Empty Leg Listing</h1><p>Route: ${departure} → ${destination}</p>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 });
  }
}

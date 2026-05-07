import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, from, to } = body;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mayfair & Main <onboarding@resend.dev>',
        to: ['solanadebrief@gmail.com'],
        subject: `📜 New Charter Quote — ${firstName} ${lastName}`,
        html: `<h1>New Charter Inquiry</h1><p>From: ${firstName} ${lastName}</p><p>Route: ${from} → ${to}</p>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

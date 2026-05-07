import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await req.json();
    const { flightId, departure, destination, date, time, aircraft, price, passengerName, passengerEmail } = body;

    const totalCents = Math.round(parseFloat(price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: passengerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Empty Leg Flight — ${departure} → ${destination}`,
              description: `${date} at ${time} · ${aircraft}`,
              images: ['https://mayfairmain.vercel.app/images/heavy_jet.png'],
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        flightId,
        departure,
        destination,
        date,
        time,
        aircraft,
        passengerName,
        passengerEmail,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mayfairmain.vercel.app'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mayfairmain.vercel.app'}/checkout/${flightId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

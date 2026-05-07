import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const SOFT_HOLD_AMOUNT_EUR = 2000; // €2,000 card hold — not charged until captured

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await req.json();
    const { flightId, departure, destination, date, time, aircraft, price, passengerName, passengerEmail } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: passengerEmail,
      payment_intent_data: {
        capture_method: 'manual', // Card is authorized but NOT charged — soft hold
        description: `Soft Hold — ${departure} → ${destination} (${date})`,
        metadata: {
          flightId,
          departure,
          destination,
          date,
          time,
          aircraft,
          fullFlightPrice: price,
          passengerName,
          passengerEmail,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Soft Hold — ${departure} → ${destination}`,
              description: `${date} at ${time} · ${aircraft} · Card authorization only — no charge until confirmed`,
            },
            unit_amount: SOFT_HOLD_AMOUNT_EUR * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mayfairmain.vercel.app'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mayfairmain.vercel.app'}/checkout/${flightId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

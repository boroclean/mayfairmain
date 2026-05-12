import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const SOFT_HOLD_AMOUNT_EUR = 2000; // €2,000 card hold — not charged until captured

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await req.json();
    const { flightId, departure, destination, date, time, aircraft, price, passengerName, passengerEmail } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
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
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

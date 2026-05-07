import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { flightId, departure, destination, date, time, aircraft, price, passengerName, passengerEmail, passengerPhone, passengers, notes } = req.body;

    await resend.emails.send({
      from: 'Mayfair & Main <onboarding@resend.dev>',
      to: ['solanadebrief@gmail.com'],
      subject: `🛫 Empty Leg Booking — ${departure} → ${destination}`,
      html: `<h1>Booking Request</h1><p>Route: ${departure} → ${destination}</p><p>Name: ${passengerName}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

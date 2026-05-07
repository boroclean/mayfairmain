import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { departure, destination, date, time, aircraft } = req.body;

    await resend.emails.send({
      from: 'Mayfair & Main <onboarding@resend.dev>',
      to: ['solanadebrief@gmail.com'],
      subject: `✨ New Empty Leg Listed — ${departure} → ${destination}`,
      html: `<h1>Listing Uploaded</h1><p>Route: ${departure} → ${destination}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send notification email' });
  }
}

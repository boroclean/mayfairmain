import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Example Webhook Endpoint for B2B Flight Management Systems (e.g., Leon Software, Avinode)
 * External systems send a POST request here when an operator creates a new empty leg.
 */
export async function POST(request: Request) {
  try {
    // 1. Verify the API Key to ensure only trusted partners can push data
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.B2B_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized Partner" }, { status: 401 });
    }

    // 2. Parse the incoming JSON from the external database
    const payload = await request.json();
    
    /* Example Incoming Payload from an Operator's Software:
    {
      "operator_id": "EURO-JET-001",
      "dep_airport": "London Farnborough (FAB)",
      "arr_airport": "Nice Côte d'Azur (NCE)",
      "date": "Jun 15, 2026",
      "time": "14:00",
      "aircraft_model": "Citation XLS",
      "seats": 8,
      "net_price_eur": 10000
    }
    */

    // 3. Transform data to our format & Automatically Calculate our 10% Margin
    const netPrice = payload.net_price_eur;
    const ourMargin = Math.round(netPrice * 0.10);

    // 4. Insert directly into our Supabase Database
    const { data, error } = await supabase
      .from("empty_legs")
      .insert([
        {
          departure_airport: payload.dep_airport,
          destination_airport: payload.arr_airport,
          departure_date: payload.date,
          departure_time: payload.time || "TBD",
          aircraft_model: payload.aircraft_model,
          aircraft_category: "Midsize Jet", // Ideally mapped from their data
          seats: payload.seats || 8,
          net_price: netPrice,
          broker_fee: ourMargin,
          status: "available" // Instantly goes live on the Mayfair & Main website
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Empty leg automatically synced to Mayfair & Main Database!" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

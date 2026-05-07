import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Create Supabase client inside handler so it only runs at request time, not build time
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.B2B_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized Partner" }, { status: 401 });
    }

    const payload = await request.json();

    const netPrice = payload.net_price_eur;
    const ourMargin = Math.round(netPrice * 0.10);

    const { error } = await supabase
      .from("empty_legs")
      .insert([
        {
          departure_airport: payload.dep_airport,
          destination_airport: payload.arr_airport,
          departure_date: payload.date,
          departure_time: payload.time || "TBD",
          aircraft_model: payload.aircraft_model,
          aircraft_category: "Midsize Jet",
          seats: payload.seats || 8,
          net_price: netPrice,
          broker_fee: ourMargin,
          status: "available",
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Empty leg synced!" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

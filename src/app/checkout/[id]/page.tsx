"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function getCountryFlag(airport: string) {
  if (!airport) return "";
  const lower = airport.toLowerCase();
  if (lower.includes("london") || lower.includes("uk") || lower.includes("fab") || lower.includes("bqh") || lower.includes("ltn") || lower.includes("lcy")) return "🇬🇧";
  if (lower.includes("paris") || lower.includes("nice") || lower.includes("france") || lower.includes("lbg") || lower.includes("nce")) return "🇫🇷";
  if (lower.includes("geneva") || lower.includes("zurich") || lower.includes("switzerland") || lower.includes("gva") || lower.includes("zrh")) return "🇨🇭";
  if (lower.includes("new york") || lower.includes("los angeles") || lower.includes("miami") || lower.includes("teb") || lower.includes("vny") || lower.includes("opf") || lower.includes("hpn")) return "🇺🇸";
  if (lower.includes("dubai") || lower.includes("uae") || lower.includes("dwc")) return "🇦🇪";
  if (lower.includes("budapest") || lower.includes("hungary") || lower.includes("bud")) return "🇭🇺";
  if (lower.includes("ibiza") || lower.includes("spain") || lower.includes("ibz")) return "🇪🇸";
  if (lower.includes("olbia") || lower.includes("italy") || lower.includes("olb")) return "🇮🇹";
  if (lower.includes("maldives") || lower.includes("mle")) return "🇲🇻";
  return "✈️";
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const legId = params.id;
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Passenger fields
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengers, setPassengers] = useState('');

  useEffect(() => {
    async function fetchFlight() {
      const { data, error } = await supabase
        .from('empty_legs')
        .select('*')
        .eq('id', legId)
        .single();

      if (data) {
        setFlight(data);
      }
      setLoading(false);
    }
    fetchFlight();
  }, [legId]);

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-gold)" }}>Loading Secure Checkout...</div>;
  if (!flight) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>Flight not found or no longer available.</div>;

  const totalPrice = flight.net_price + flight.broker_fee;
  const depositAmount = 2000;
  const balanceAmount = totalPrice - depositAmount;

  const handleCheckout = async () => {
    if (!passengerName || !passengerEmail) {
      alert('Please fill in the lead passenger name and email.');
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: legId,
          departure: flight.departure_airport,
          destination: flight.destination_airport,
          date: flight.departure_date,
          time: flight.departure_time,
          aircraft: flight.aircraft_model,
          price: flight.net_price + flight.broker_fee,
          passengerName, passengerEmail, passengerPhone, passengers,
        }),
      });
      alert('Soft Hold Successful! Mayfair & Main will contact you shortly with the Charter Agreement and wire instructions.');
      window.location.href = '/';
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      {/* Minimal Checkout Nav */}
      <nav style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", background: "var(--bg-secondary)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--accent-gold)" }}>
          MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>&</span> MAIN
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Secure Booking Portal</span>
          <span style={{ color: "#25D366" }}>🔒 256-bit Encryption</span>
        </div>
      </nav>

      <section style={{ padding: "4rem 2rem", flex: 1, display: "flex", justifyContent: "center" }}>
        <div className="mobile-stack-reverse" style={{ width: "100%", maxWidth: "1200px", display: "grid", gridTemplateColumns: "1fr 400px", gap: "4rem" }}>
          
          {/* Left Side: Booking Form */}
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>Complete Your Booking</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "3rem", fontSize: "1.1rem" }}>Please provide lead passenger details to secure this flight.</p>

            <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Passenger Details</h2>
              
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Lead Passenger Full Name</label>
                  <input type="text" value={passengerName} onChange={e => setPassengerName(e.target.value)} placeholder="e.g. John Smith" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Email Address</label>
                  <input type="email" value={passengerEmail} onChange={e => setPassengerEmail(e.target.value)} placeholder="For charter agreement" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>

              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Phone Number</label>
                  <input type="tel" value={passengerPhone} onChange={e => setPassengerPhone(e.target.value)} placeholder="+44" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Total Passengers</label>
                  <input type="number" value={passengers} onChange={e => setPassengers(e.target.value)} placeholder="e.g. 4" min="1" max={flight.seats} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Dietary Requirements & Notes</label>
                <textarea rows={3} placeholder="e.g. Vegetarian catering requested" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", resize: "none" }} />
              </div>
            </div>

            <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Secure Soft Hold Authorization</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
                Because empty legs are subject to final operator confirmation, we do not charge the full amount instantly. 
                Please provide your card details to place a secure <strong>€2,000 hold</strong>. If the flight is unavailable, the hold is released instantly.
              </p>

              {/* Mock Credit Card Input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Expiry</label>
                    <input type="text" placeholder="MM/YY" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>CVC</label>
                    <input type="text" placeholder="123" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", alignItems: "flex-start" }}>
                <input 
                  type="checkbox" 
                  id="client-terms" 
                  checked={agreedToTerms} 
                  onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  style={{ accentColor: "var(--accent-gold)", marginTop: "4px" }} 
                />
                <label htmlFor="client-terms" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, cursor: "pointer" }}>
                  I expressly agree to the <Link href="/terms" target="_blank" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Charter Terms & Conditions</Link>, and acknowledge that Empty Legs are subject to cancellation if the primary flight alters.
                </label>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || !agreedToTerms}
                className="btn" 
                style={{ width: "100%", padding: "18px", marginTop: "2rem", fontSize: "1.1rem", background: "var(--accent-gold)", color: "var(--bg-primary)", opacity: (isSubmitting || !agreedToTerms) ? 0.5 : 1, cursor: (isSubmitting || !agreedToTerms) ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? "Processing Hold..." : `Authorize €${depositAmount.toLocaleString()} Hold`}
              </button>
              
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1.5rem" }}>
                By clicking authorize, you agree to Mayfair & Main's Terms & Conditions.
              </p>
            </div>

          </div>

          {/* Right Side: Flight Summary */}
          <div>
            <div style={{ background: "rgba(10, 17, 13, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: "8px", position: "sticky", top: "2rem" }}>
              <div style={{ padding: "2rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Flight Summary</h3>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Routing</div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{getCountryFlag(flight.departure_airport)} {flight.departure_airport}</div>
                  <div style={{ color: "var(--accent-gold)", margin: "4px 0", fontSize: "0.9rem" }}>↓ to</div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{getCountryFlag(flight.destination_airport)} {flight.destination_airport}</div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Date & Time</div>
                  <div style={{ fontWeight: 600 }}>{flight.departure_date}</div>
                  <div style={{ color: "var(--text-secondary)" }}>{flight.departure_time} Local</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Aircraft</div>
                  <div style={{ fontWeight: 600 }}>{flight.aircraft_model}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{flight.aircraft_category} &middot; {flight.seats} Seats</div>
                </div>
              </div>

              <div style={{ padding: "2rem", background: "rgba(212, 175, 55, 0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-secondary)" }}>
                  <span>Total Flight Cost</span>
                  <span>€{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-primary)", fontWeight: "bold" }}>
                  <span>Soft Hold (Due Now)</span>
                  <span>€{depositAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem", marginTop: "1rem" }}>
                  <span>Balance (Due via Wire)</span>
                  <span>€{balanceAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

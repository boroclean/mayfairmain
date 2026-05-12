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

  // Billing fields
  const [billingType, setBillingType] = useState('individual'); // 'individual' or 'company'
  const [passengerName, setPassengerName] = useState(''); // Used for individual name or contact person
  const [companyName, setCompanyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingStreetAddress, setBillingStreetAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [petType, setPetType] = useState('none'); // 'none', 'dog', 'cat'
  const [petWeight, setPetWeight] = useState('');
  const [petPassport, setPetPassport] = useState('');
  const [agreedToPetPolicy, setAgreedToPetPolicy] = useState(false);

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

  const isGlobeAir = flight && (
    flight.aircraft_model === "Cessna Citation Mustang" || 
    flight.aircraft_model?.includes("Cessna")
  );

  const isUKDestination = flight && (
    flight.destination_airport.toLowerCase().includes("london") ||
    flight.destination_airport.toLowerCase().includes("uk") ||
    flight.destination_airport.toLowerCase().includes("fab") ||
    flight.destination_airport.toLowerCase().includes("bqh") ||
    flight.destination_airport.toLowerCase().includes("ltn") ||
    flight.destination_airport.toLowerCase().includes("lcy")
  );

  const totalPrice = flight.net_price + flight.broker_fee;
  const depositAmount = Math.min(2000, totalPrice);
  const balanceAmount = totalPrice - depositAmount;

  const handleSoftHold = async () => {
    if (billingType === 'individual' && !passengerName) {
      alert('Please fill in your full name.');
      return;
    }
    if (billingType === 'company' && (!companyName || !taxNumber)) {
      alert('Please fill in your company name and tax number.');
      return;
    }
    if (!passengerEmail || !passengerPhone) {
      alert('Please fill in your email and phone number.');
      return;
    }
    if (!billingCountry || !billingCity || !billingPostalCode || !billingStreetAddress) {
      alert('Please fill in your complete billing address (Country, City, Postal Code, and Street Address).');
      return;
    }
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    if (petType !== 'none') {
      if (!petWeight || !petPassport) {
        alert('Please fill in your pet\'s weight and passport number.');
        return;
      }
      if (!agreedToPetPolicy) {
        alert('Please agree to the pet policy.');
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: legId,
          departure: flight.departure_airport,
          destination: flight.destination_airport,
          date: flight.departure_date,
          time: flight.departure_time,
          aircraft: flight.aircraft_model,
          price: totalPrice,
          passengerName, passengerEmail, passengerPhone,
          billingType,
          companyName,
          taxNumber,
          billingCountry,
          billingCity,
          billingPostalCode,
          billingStreetAddress,
          additionalNotes,
          petType,
          petWeight,
          petPassport,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again or contact us via WhatsApp.');
      setIsSubmitting(false);
    }
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
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Billing Details</h2>

              {/* Individual / Company Toggle */}
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                  <input type="radio" name="billingType" value="individual" checked={billingType === 'individual'} onChange={e => setBillingType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} />
                  Individual
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                  <input type="radio" name="billingType" value="company" checked={billingType === 'company'} onChange={e => setBillingType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} />
                  Company
                </label>
              </div>

              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                {billingType === 'individual' ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Full Name</label>
                    <input type="text" value={passengerName} onChange={e => setPassengerName(e.target.value)} placeholder="e.g. John Smith" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Company Name</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>VAT / Tax Number</label>
                      <input type="text" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} placeholder="e.g. EU12345678" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                  </>
                )}
              </div>

              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Email Address</label>
                  <input type="email" value={passengerEmail} onChange={e => setPassengerEmail(e.target.value)} placeholder="For invoices & agreement" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Phone Number</label>
                  <input type="tel" value={passengerPhone} onChange={e => setPassengerPhone(e.target.value)} placeholder="+44" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>

              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Country</label>
                  <input type="text" list="countries" value={billingCountry} onChange={e => setBillingCountry(e.target.value)} placeholder="Type or select country" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  <datalist id="countries">
                    <option value="United Kingdom" />
                    <option value="France" />
                    <option value="Monaco" />
                    <option value="Switzerland" />
                    <option value="Italy" />
                    <option value="Spain" />
                    <option value="Germany" />
                    <option value="Austria" />
                    <option value="Belgium" />
                    <option value="Netherlands" />
                    <option value="United States" />
                    <option value="United Arab Emirates" />
                  </datalist>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>City</label>
                  <input type="text" value={billingCity} onChange={e => setBillingCity(e.target.value)} placeholder="e.g. London" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>

              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Postal Code</label>
                  <input type="text" value={billingPostalCode} onChange={e => setBillingPostalCode(e.target.value)} placeholder="e.g. SW1A 1AA" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Address (Street & Number)</label>
                  <input type="text" value={billingStreetAddress} onChange={e => setBillingStreetAddress(e.target.value)} placeholder="e.g. 10 Downing Street" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>
            </div>

            {/* Pet Policy Section */}
            {isGlobeAir && (
              <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Travel with Pets</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Are you traveling with a pet?</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                        <input type="radio" name="petType" value="none" checked={petType === 'none'} onChange={e => setPetType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} />
                        None
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                        <input type="radio" name="petType" value="dog" checked={petType === 'dog'} onChange={e => setPetType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} style={{ accentColor: "var(--accent-gold)" }} />
                        Dog 🐶
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                        <input type="radio" name="petType" value="cat" checked={petType === 'cat'} onChange={e => setPetType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} style={{ accentColor: "var(--accent-gold)" }} />
                        Cat 🐱
                      </label>
                    </div>
                  </div>

                  {petType !== 'none' && (
                    <>
                      <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Pet Weight</label>
                          <input type="text" value={petWeight} onChange={e => setPetWeight(e.target.value)} placeholder="e.g. 5 kg" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Passport Number</label>
                          <input type="text" value={petPassport} onChange={e => setPetPassport(e.target.value)} placeholder="e.g. EU123456" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                        </div>
                      </div>

                      <div style={{ padding: "1rem", background: "rgba(212, 175, 55, 0.05)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "4px" }}>
                        <p style={{ color: "var(--accent-gold)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                          Any pets with a maximum weight of 8 kg are welcome on-board. For further information please contact our Customer Care Team.
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input type="checkbox" id="petPolicy" checked={agreedToPetPolicy} onChange={e => setAgreedToPetPolicy(e.target.checked)} style={{ accentColor: "var(--accent-gold)" }} />
                        <label htmlFor="petPolicy" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                          I agree to the <Link href="/pet-policy" target="_blank" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Pet Policy</Link>.
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information Section */}
            <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Additional Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Dietary Requirements & Notes</label>
                <textarea rows={3} value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="e.g. Vegetarian catering, preferred plane model requests, or any other notes" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", resize: "none" }} />
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

              {/* Single Soft Hold button via Stripe */}
              <button
                onClick={handleSoftHold}
                disabled={isSubmitting || !agreedToTerms}
                className="btn"
                style={{ width: "100%", padding: "18px", marginTop: "2rem", fontSize: "1.05rem", background: "var(--accent-gold)", color: "var(--bg-primary)", opacity: (isSubmitting || !agreedToTerms) ? 0.5 : 1, cursor: (isSubmitting || !agreedToTerms) ? "not-allowed" : "pointer", fontWeight: 700 }}
              >
                {isSubmitting ? "Redirecting to Secure Payment..." : "Authorize €2,000 Soft Hold"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1.25rem", lineHeight: 1.6 }}>
                Your card is <strong style={{ color: "var(--text-primary)" }}>authorized only</strong> — not charged.<br />
                If confirmed, we collect the balance via wire transfer.<br />
                If cancelled, the hold is released with <strong style={{ color: "var(--text-primary)" }}>zero fees</strong>.
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
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <span>Card Hold (Auth Only)</span>
                  <span style={{ color: "var(--accent-gold)" }}>€2,000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  <span>Balance (Wire on Confirmation)</span>
                  <span>€{(totalPrice - 2000).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-primary)", fontWeight: "bold", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", fontSize: "1.05rem" }}>
                  <span>Total Flight Cost</span>
                  <span style={{ color: "var(--accent-gold)" }}>€{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

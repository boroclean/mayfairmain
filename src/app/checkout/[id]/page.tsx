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
  const [currentStep, setCurrentStep] = useState(1);
  const [hasInsurance, setHasInsurance] = useState(false);

  // Billing fields
  const [billingType, setBillingType] = useState('individual'); // 'individual' or 'company'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setCurrentStep(3);
    }
  }, []);

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
  const isGlobeAir = flight && (
    flight.aircraft_model === "Cessna Citation Mustang" || 
    flight.aircraft_model?.includes("Cessna")
  );

  useEffect(() => {
    if (flight && !isGlobeAir && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [flight, isGlobeAir, currentStep]);

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-gold)" }}>Loading Secure Checkout...</div>;
  if (!flight) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>Flight not found or no longer available.</div>;

  const isUKDestination = flight && (
    flight.destination_airport.toLowerCase().includes("london") ||
    flight.destination_airport.toLowerCase().includes("uk") ||
    flight.destination_airport.toLowerCase().includes("fab") ||
    flight.destination_airport.toLowerCase().includes("bqh") ||
    flight.destination_airport.toLowerCase().includes("ltn") ||
    flight.destination_airport.toLowerCase().includes("lcy")
  );

  const totalPrice = flight.net_price + flight.broker_fee;
  const insurancePrice = totalPrice * 0.10;
  const finalPrice = totalPrice + (hasInsurance ? insurancePrice : 0);
  const depositAmount = Math.min(2000, finalPrice);
  const balanceAmount = finalPrice - depositAmount;

  const handleSoftHold = async () => {
    if (!firstName || !lastName) {
      alert('Please fill in your first and last name.');
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
          price: finalPrice,
          hasInsurance,
          firstName,
          lastName,
          passengerEmail,
          passengerPhone,
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
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .step-transition {
          animation: fadeInSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
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
        
        {/* Step 1: Pets, Info, Insurance (GlobeAir Only) */}
        {currentStep === 1 && isGlobeAir && (
          <div className="step-transition" style={{ width: "100%", maxWidth: "800px" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{ color: "var(--accent-gold)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>Step 1</span>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--text-primary)", marginTop: "0.5rem" }}>Flight Customization</h1>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Tailor your GlobeAir flight experience.</p>
            </div>

            {/* Pet Policy Section */}
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
                      <input type="radio" name="petType" value="dog" checked={petType === 'dog'} onChange={e => setPetType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} />
                      Dog 🐶
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", cursor: "pointer" }}>
                      <input type="radio" name="petType" value="cat" checked={petType === 'cat'} onChange={e => setPetType(e.target.value)} style={{ accentColor: "var(--accent-gold)" }} />
                      Cat 🐱
                    </label>
                  </div>
                </div>

                {petType !== 'none' && (
                  <>
                    <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Pet Weight (kg)</label>
                        <input type="number" value={petWeight} onChange={e => setPetWeight(e.target.value)} placeholder="Max 8 kg" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                        <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "4px" }}>
                          Any pets with a maximum weight of 8 kg are welcome on-board. For further information please contact our Customer Care Team.
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Pet Passport Number</label>
                        <input type="text" value={petPassport} onChange={e => setPetPassport(e.target.value)} placeholder="Required for travel" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "4px" }}>
                      <input type="checkbox" id="petPolicy" checked={agreedToPetPolicy} onChange={e => setAgreedToPetPolicy(e.target.checked)} style={{ marginTop: "3px", accentColor: "var(--accent-gold)" }} />
                      <label htmlFor="petPolicy" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                        I agree to the <Link href="/pet-policy" target="_blank" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Pet Policy</Link>.
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Additional Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Dietary Requirements & Notes</label>
                <textarea rows={3} value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="e.g. Vegetarian catering, preferred plane model requests, or any other notes" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", resize: "none" }} />
              </div>
            </div>

            {/* Insurance Section */}
            <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Cancellation Insurance</h2>
              
              <div style={{ border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: "8px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ background: "rgba(212, 175, 55, 0.1)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="insurance" checked={hasInsurance} onChange={e => setHasInsurance(e.target.checked)} style={{ accentColor: "var(--accent-gold)", transform: "scale(1.2)" }} />
                    <label htmlFor="insurance" style={{ fontWeight: "600", color: "var(--text-primary)", cursor: "pointer" }}>Refundable Booking</label>
                    <span style={{ background: "#25D366", color: "white", fontSize: "0.7rem", padding: "2px 6px", borderRadius: "10px", textTransform: "uppercase" }}>Recommended</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--text-primary)", fontWeight: "bold" }}>+€{insurancePrice.toLocaleString()}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>10% of Total</div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "2rem", background: "rgba(10, 17, 13, 0.5)" }}>
                  <div style={{ background: "rgba(37, 211, 102, 0.1)", color: "#25D366", padding: "0.75rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>✓ Illness / Injury (including Covid)</span>
                    <Link href="/insurance-policy" target="_blank" style={{ color: "#25D366", textDecoration: "underline", fontSize: "0.8rem" }}>See details</Link>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Pre-existing Medical Conditions</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Home Emergency</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Public Transport Failure</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Theft of Documents</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Flight Disruption</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Court Summons</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Transport Breakdown</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#25D366" }}>✓</span> Severe Weather</div>
                  </div>

                  <div style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    Upgrade your booking and receive a refund if you cannot attend due to many reasons. See the full <Link href="/insurance-policy" target="_blank" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Insurance Policy</Link>.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => {
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
                setCurrentStep(2);
              }} style={{ padding: "1rem 3rem", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Proceed to Billing
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Billing, Payment, Summary */}
        {currentStep === 2 && (
          <div className="mobile-stack-reverse step-transition" style={{ width: "100%", maxWidth: "1200px", display: "grid", gridTemplateColumns: "1fr 400px", gap: "4rem" }}>
            
            {/* Left Column: Forms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span style={{ color: "var(--accent-gold)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>Step 2</span>
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--text-primary)", marginTop: "0.5rem" }}>Billing & Payment</h1>
              </div>

              {/* Billing Details Section */}
              <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
                <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Billing Details</h2>
                
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. John" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Smith" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>

                {billingType === 'company' && (
                  <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Company Name</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>VAT / Tax Number</label>
                      <input type="text" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} placeholder="e.g. EU12345678" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                  </div>
                )}

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

              {/* Secure Soft Hold Section */}
              <div style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
                <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>Secure Soft Hold Authorization</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
                  Because empty legs are subject to final operator confirmation, we do not charge the full amount instantly.
                  Please provide your card details to place a secure <strong>€{depositAmount.toLocaleString()} hold</strong>. If the flight is unavailable, the hold is released instantly.
                </p>

                {/* Mock Credit Card Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Card Number</label>
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Expiry Date</label>
                      <input type="text" placeholder="MM / YY" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>CVV</label>
                      <input type="text" placeholder="xxx" style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginTop: "2rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "4px" }}>
                  <input type="checkbox" id="terms" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} style={{ marginTop: "3px", accentColor: "var(--accent-gold)" }} />
                  <label htmlFor="terms" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    I understand this is a hold, not a charge. I agree to the <Link href="/terms" target="_blank" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Terms of Service</Link> and the cancellation policy.
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {isGlobeAir && (
                  <button onClick={() => setCurrentStep(1)} style={{ padding: "1rem 2rem", background: "transparent", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Back
                  </button>
                )}
                <button onClick={handleSoftHold} disabled={isSubmitting} style={{ padding: "1rem 3rem", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: isSubmitting ? 0.7 : 1, marginLeft: "auto" }}>
                  {isSubmitting ? 'Processing...' : `Authorize €${depositAmount.toLocaleString()} Hold`}
                </button>
              </div>
            </div>

            {/* Right Column: Flight Summary */}
            <div style={{ position: "sticky", top: "2rem", height: "fit-content" }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "0.05em" }}>FLIGHT SUMMARY</h3>
                  
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
                    <span>Base Flight Cost</span>
                    <span>€{totalPrice.toLocaleString()}</span>
                  </div>
                  {hasInsurance && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-secondary)" }}>
                      <span>Cancellation Insurance</span>
                      <span>€{insurancePrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <span>Card Hold (Auth Only)</span>
                    <span style={{ color: "var(--accent-gold)" }}>€{depositAmount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    <span>Balance (Wire on Confirmation)</span>
                    <span>€{balanceAmount.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-primary)", fontWeight: "bold", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", fontSize: "1.05rem" }}>
                    <span>Total Cost</span>
                    <span style={{ color: "var(--accent-gold)" }}>€{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step 3: Confirmation & Thank You */}
        {currentStep === 3 && (
          <div className="step-transition" style={{ width: "100%", maxWidth: "600px", textAlign: "center", background: "var(--bg-secondary)", padding: "4rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
            <div style={{ fontSize: "4rem", color: "var(--accent-gold)", marginBottom: "2rem" }}>✓</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "1rem" }}>Soft Hold Confirmed</h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "2rem" }}>
              Thank you for choosing Mayfair & Main. We have placed a secure hold of €{depositAmount.toLocaleString()} on your card.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "3rem" }}>
              Our team is now confirming the flight with the operator. You will receive an email confirmation and invoice shortly.
            </p>
            <Link href="/" style={{ padding: "1rem 3rem", background: "var(--accent-gold)", color: "var(--bg-primary)", textDecoration: "none", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Return to Home
            </Link>
          </div>
        )}

      </section>
    </main>
  );
}

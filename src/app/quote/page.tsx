"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AIRPORTS = [
  "London Farnborough (FAB)",
  "London Biggin Hill (BQH)",
  "London Luton (LTN)",
  "London City (LCY)",
  "Paris Le Bourget (LBG)",
  "Geneva (GVA)",
  "Nice Côte d'Azur (NCE)",
  "New York Teterboro (TEB)",
  "New York Westchester (HPN)",
  "Los Angeles Van Nuys (VNY)",
  "Dubai Al Maktoum (DWC)",
  "Budapest Ferenc Liszt (BUD)",
  "Miami Opa-Locka (OPF)",
  "Ibiza (IBZ)",
  "Olbia Costa Smeralda (OLB)",
  "Zurich (ZRH)"
];

function AutocompleteInput({ label, placeholder }: { label: string, placeholder: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredAirports = AIRPORTS.filter(airport => 
    airport.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative", flex: 1 }}>
      <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>{label}</label>
      <input 
        type="text" 
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder} 
        style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", width: "100%", outline: "none", fontSize: "1rem" }} 
      />
      
      {isOpen && query.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "var(--bg-primary)",
          border: "1px solid rgba(212, 175, 55, 0.5)",
          borderTop: "none",
          listStyle: "none",
          padding: 0,
          margin: 0,
          maxHeight: "200px",
          overflowY: "auto",
          zIndex: 20
        }}>
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport, index) => (
              <li 
                key={index}
                onClick={() => {
                  setQuery(airport);
                  setIsOpen(false);
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  borderBottom: index < filteredAirports.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => e.currentTarget.style.background = "rgba(212, 175, 55, 0.15)"}
                onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => e.currentTarget.style.background = "transparent"}
              >
                {airport}
              </li>
            ))
          ) : (
            <li style={{ padding: "12px 16px", color: "var(--text-secondary)", fontStyle: "italic" }}>No airports found...</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function Quote() {
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState('one-way');
  const [legs, setLegs] = useState([1, 2]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [notes, setNotes]         = useState('');

  // Date States
  const [depDate, setDepDate] = useState<Date | null>(null);
  const [retDate, setRetDate] = useState<Date | null>(null);
  const [legDates, setLegDates] = useState<Record<number, Date | null>>({});

  const updateLegDate = (legId: number, date: Date | null) => {
    setLegDates(prev => ({ ...prev, [legId]: date }));
  };

  const handleSubmit = async () => {
    if (!firstName || !email) { alert('Please fill in your name and email.'); return; }
    setIsSubmitting(true);
    try {
      await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, tripType, notes,
          date: depDate?.toLocaleDateString(), returnDate: retDate?.toLocaleDateString() }),
      });
      alert('Your request has been received. A broker will contact you shortly.');
    } catch { alert('Something went wrong. Please try again.'); }
    setIsSubmitting(false);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <Navbar isTransparent={true} />

      {/* Main Form Area */}
      <section style={{ 
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem 4rem",
        background: "linear-gradient(rgba(10, 17, 13, 0.8), rgba(10, 17, 13, 0.95)), url('/images/yacht.png') center/cover"
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "900px", 
          background: "rgba(10, 17, 13, 0.85)", 
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          padding: "3rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}>
          
          <h1 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem" }}>
            {step === 1 ? "Flight Itinerary" : "Passenger Details"}
          </h1>

          {/* Progress Indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
            <div style={{ width: "40px", height: "4px", background: "var(--accent-gold)" }}></div>
            <div style={{ width: "40px", height: "4px", background: step === 2 ? "var(--accent-gold)" : "rgba(255,255,255,0.1)" }}></div>
          </div>

          <form>
            {step === 1 && (
              <div style={{ animation: "fadeIn 0.5s ease" }}>
                {/* Trip Type Tabs */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  {['one-way', 'round-trip', 'multi-leg'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: tripType === type ? "var(--accent-gold)" : "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        padding: "0.5rem 1rem",
                        borderBottom: tripType === type ? "2px solid var(--accent-gold)" : "2px solid transparent",
                        transition: "all 0.3s ease",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {type.replace("-", " ")}
                    </button>
                  ))}
                </div>

                {/* Dynamic Routing Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  
                  {/* One Way & Round Trip Logic */}
                  {(tripType === 'one-way' || tripType === 'round-trip') && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      <div className="mobile-stack-flex" style={{ display: "flex", gap: "2rem" }}>
                        <AutocompleteInput label="Departure Airport" placeholder="e.g. London (FAB)" />
                        <AutocompleteInput label="Destination Airport" placeholder="e.g. Nice (NCE)" />
                      </div>
                      
                      <div className="mobile-stack-flex" style={{ display: "flex", gap: "2rem" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Departure Date</label>
                          <DatePicker 
                            selected={depDate} 
                            onChange={(date: Date | null) => setDepDate(date)} 
                            placeholderText="Select Date"
                            className="custom-datepicker-input"
                            calendarClassName="bespoke-calendar"
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                        {tripType === 'round-trip' && (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Return Date</label>
                            <DatePicker 
                              selected={retDate} 
                              onChange={(date: Date | null) => setRetDate(date)} 
                              placeholderText="Select Date"
                              className="custom-datepicker-input"
                              calendarClassName="bespoke-calendar"
                              dateFormat="MMMM d, yyyy"
                              minDate={depDate || undefined}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Passengers</label>
                          <input type="number" min="1" placeholder="e.g. 4" style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", width: "100%" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi-Leg Logic */}
                  {tripType === 'multi-leg' && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                      {legs.map((legId, index) => (
                        <div key={legId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1.5rem", border: "1px dashed rgba(212, 175, 55, 0.3)" }}>
                          <h4 style={{ color: "var(--accent-gold)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Leg {index + 1}</h4>
                          <div className="mobile-stack-flex" style={{ display: "flex", gap: "1.5rem" }}>
                            <AutocompleteInput label="Departure" placeholder="City or Airport code" />
                            <AutocompleteInput label="Destination" placeholder="City or Airport code" />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Date</label>
                              <DatePicker 
                                selected={legDates[legId]} 
                                onChange={(date: Date | null) => updateLegDate(legId, date)} 
                                placeholderText="Select Date"
                                className="custom-datepicker-input"
                                calendarClassName="bespoke-calendar"
                                dateFormat="MMMM d, yyyy"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setLegs([...legs, legs.length + 1])}
                        style={{ background: "transparent", border: "1px solid var(--text-secondary)", color: "var(--text-primary)", padding: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem" }}
                      >
                        + Add Another Leg
                      </button>
                    </div>
                  )}

                </div>

                <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="btn" 
                    style={{ padding: "16px 48px", fontSize: "1rem" }}
                  >
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: "fadeIn 0.5s ease" }}>
                
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>First Name</label>
                    <input type="text" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} placeholder="John" style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} placeholder="Doe" style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>

                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Email Address</label>
                    <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="john@example.com" style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Phone Number</label>
                    <input type="tel" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} placeholder="+44 20 7123 4567" style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "3rem" }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Additional Requests</label>
                  <textarea rows={4} value={notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)} placeholder="Specific aircraft models, catering preferences, or ground transportation requirements..." style={{ padding: "16px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", resize: "vertical" }}></textarea>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.85rem" }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn" 
                    style={{ padding: "16px 48px", fontSize: "1rem", background: "var(--accent-gold)", color: "var(--bg-primary)", opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Request'}
                  </button>
                </div>

              </div>
            )}
          </form>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

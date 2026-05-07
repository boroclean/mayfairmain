"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabase";

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

function AutocompleteInput({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredAirports = AIRPORTS.filter(airport => 
    airport.toLowerCase().includes(value.toLowerCase())
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
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder} 
        style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", width: "100%", outline: "none" }} 
      />
      
      {isOpen && value.length > 0 && (
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
                  onChange(airport);
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

export default function OperatorPortal() {
  // Form State
  const [depDate, setDepDate] = useState<Date | null>(null);
  const [depAirport, setDepAirport] = useState("");
  const [destAirport, setDestAirport] = useState("");
  const [depTime, setDepTime] = useState("");
  const [aircraftModel, setAircraftModel] = useState("");
  const [category, setCategory] = useState("Very Light Jet");
  const [seats, setSeats] = useState("");
  const [netPrice, setNetPrice] = useState("");
  const [petFriendly, setPetFriendly] = useState(false);
  const [smokingPermitted, setSmokingPermitted] = useState(false);
  const [wifiAvailable, setWifiAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!depDate || !depAirport || !destAirport || !netPrice || !depTime) {
      alert("Please fill out all required fields, including Departure Time.");
      return;
    }

    const departureDateTime = new Date(`${depDate.toDateString()} ${depTime}`);
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (departureDateTime < twoHoursFromNow) {
      alert("Empty legs must be uploaded at least 2 hours before the departure time.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('empty_legs')
      .insert([
        {
          departure_airport: depAirport,
          destination_airport: destAirport,
          departure_date: depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          departure_time: depTime,
          aircraft_model: aircraftModel,
          aircraft_category: category,
          seats: parseInt(seats) || 1,
          net_price: parseInt(netPrice) || 0,
          broker_fee: Math.round((parseInt(netPrice) || 0) * 0.10), // Auto 10% markup
          pet_friendly: petFriendly,
          smoking_permitted: smokingPermitted,
          wifi_available: wifiAvailable,
          status: 'available'
        }
      ]);

    if (error) {
      console.error(error);
      alert("Error uploading to database.");
    } else {
      // Notify broker by email
      await fetch('/api/send-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departure: depAirport, destination: destAirport,
          date: depDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: depTime, aircraft: aircraftModel, category, seats: parseInt(seats) || 1,
          netPrice: parseInt(netPrice) || 0,
          brokerFee: Math.round((parseInt(netPrice) || 0) * 0.10),
          petFriendly, wifiAvailable, smokingPermitted
        }),
      });
      alert("Empty Leg Successfully Published to Global Database!");
      setDepAirport(""); setDestAirport(""); setDepDate(null); setDepTime("");
      setAircraftModel(""); setSeats(""); setNetPrice("");
      setPetFriendly(false); setSmokingPermitted(false); setWifiAvailable(false);
    }
    setIsSubmitting(true);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <nav style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.2rem", letterSpacing: "0.1em", textDecoration: "none" }}>
          MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>&</span> MAIN
        </Link>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Operator Portal</div>
      </nav>

      {/* Hero Section */}
      <section style={{ flex: 1, padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>Upload Empty Leg</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>Publish your repositioning flight to our global database. Define your net price and the broker commission you are willing to offer.</p>

          <form style={{ background: "var(--bg-secondary)", padding: "3rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
            
            {/* Flight Details */}
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>1. Flight Details</h2>
            
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
              <AutocompleteInput label="Departure Airport" placeholder="e.g. London Farnborough (FAB)" value={depAirport} onChange={setDepAirport} />
              <AutocompleteInput label="Destination Airport" placeholder="e.g. Nice (NCE)" value={destAirport} onChange={setDestAirport} />
            </div>

            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Date</label>
                <DatePicker 
                  selected={depDate} 
                  onChange={(date: Date | null) => setDepDate(date)} 
                  placeholderText="Select Date"
                  className="custom-datepicker-input"
                  calendarClassName="bespoke-calendar"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Departure Time (Local)</label>
                <input type="time" value={depTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepTime(e.target.value)} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", colorScheme: "dark" }} />
              </div>
            </div>

            {/* Aircraft Details */}
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>2. Aircraft & Capacity</h2>
            
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Aircraft Model</label>
                <input type="text" placeholder="e.g. Gulfstream G650" value={aircraftModel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAircraftModel(e.target.value)} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Category</label>
                <select value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }}>
                  <option>Very Light Jet</option>
                  <option>Light Jet</option>
                  <option>Super Light Jet</option>
                  <option>Midsize Jet</option>
                  <option>Super Midsize Jet</option>
                  <option>Heavy Jet</option>
                  <option>Ultra Long Range</option>
                  <option>VIP Airliner</option>
                </select>
              </div>
            </div>

            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Available Seats</label>
                <input type="number" placeholder="e.g. 12" value={seats} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeats(e.target.value)} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Amenities</label>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="button" onClick={() => setPetFriendly(!petFriendly)} style={{ flex: 1, padding: "8px", background: petFriendly ? "rgba(212, 175, 55, 0.2)" : "transparent", border: "1px solid rgba(212, 175, 55, 0.3)", color: petFriendly ? "var(--accent-gold)" : "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer" }}>PETS</button>
                  <button type="button" onClick={() => setWifiAvailable(!wifiAvailable)} style={{ flex: 1, padding: "8px", background: wifiAvailable ? "rgba(212, 175, 55, 0.2)" : "transparent", border: "1px solid rgba(212, 175, 55, 0.3)", color: wifiAvailable ? "var(--accent-gold)" : "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer" }}>WIFI</button>
                  <button type="button" onClick={() => setSmokingPermitted(!smokingPermitted)} style={{ flex: 1, padding: "8px", background: smokingPermitted ? "rgba(212, 175, 55, 0.2)" : "transparent", border: "1px solid rgba(212, 175, 55, 0.3)", color: smokingPermitted ? "var(--accent-gold)" : "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer" }}>SMOKE</button>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>3. Pricing (EUR)</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "3rem" }}>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Operator Net Price (€)</label>
              <input type="number" placeholder="e.g. 12500" value={netPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNetPrice(e.target.value)} style={{ padding: "14px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none", fontSize: "1.5rem" }} />
              <p style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "0.5rem" }}>+ 10% Broker Commission will be added to the client listed price.</p>
            </div>

            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn" 
              style={{ width: "100%", padding: "20px", fontSize: "1.1rem", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Publishing to Marketplace..." : "Publish Empty Leg"}
            </button>

          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(212, 175, 55, 0.1)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>&copy; 2026 MAYFAIR & MAIN | OPERATOR RELATIONS</p>
      </footer>
    </main>
  );
}

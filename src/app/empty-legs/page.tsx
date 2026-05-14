"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

function getCityAndCode(airportString: string) {
  if (!airportString) return "";
  const match = airportString.match(/\(([^)]+)\)/);
  const code = match ? match[1] : "";

  // Extract city name (everything before the first parenthesis)
  const cityMatch = airportString.match(/^(.*?)\s*\(/);
  const city = cityMatch ? cityMatch[1] : airportString.split(' ')[0];

  return code ? `${city} (${code})` : city;
}

function getFlag(airportString: string) {
  if (!airportString) return "";
  
  // Extract code in parentheses
  const match = airportString.match(/\(([^)]+)\)/);
  const code = match ? match[1].toUpperCase() : "";

  const flagMap: { [key: string]: string } = {
    // UK
    "BQH": "🇬🇧", "LTN": "🇬🇧", "LCY": "🇬🇧", "FAB": "🇬🇧", "NHT": "🇬🇧", "STN": "🇬🇧", "SEN": "🇬🇧",
    // France
    "LBG": "🇫🇷", "NCE": "🇫🇷", "TLS": "🇫🇷", "SDH": "🇫🇷", "ANG": "🇫🇷", "MRS": "🇫🇷", "LYS": "🇫🇷", "CGF": "🇫🇷", "LRH": "🇫🇷", "CEQ": "🇫🇷", "BOD": "🇫🇷", "CTT": "🇫🇷", "BOD": "🇫🇷",
    // Germany
    "NUE": "🇩🇪", "OBF": "🇩🇪", "CGN": "🇩🇪", "DUS": "🇩🇪", "DTM": "🇩🇪", "LEJ": "🇩🇪", "BRE": "🇩🇪", "MUC": "🇩🇪", "ERF": "🇩🇪", "FDH": "🇩🇪", "HAM": "🇩🇪", "TXL": "🇩🇪", "BER": "🇩🇪", "FRA": "🇩🇪", "FMO": "🇩🇪", "STR": "🇩🇪", "HAJ": "🇩🇪",
    // Switzerland
    "GVA": "🇨🇭", "ZRH": "🇨🇭", "BRN": "🇨🇭", "BSL": "🇨🇭", "SIR": "🇨🇭", "LUG": "🇨🇭",
    // Italy
    "BLQ": "🇮🇹", "OLB": "🇮🇹", "VRN": "🇮🇹", "MXP": "🇮🇹", "LIN": "🇮🇹", "VCE": "🇮🇹", "NAP": "🇮🇹", "CIA": "🇮🇹", "FCO": "🇮🇹", "FLR": "🇮🇹", "PSA": "🇮🇹",
    // Spain
    "IBZ": "🇪🇸", "PMI": "🇪🇸", "BCN": "🇪🇸", "MAD": "🇪🇸", "AGP": "🇪🇸", "VLC": "🇪🇸", "ALC": "🇪🇸",
    // Austria
    "VIE": "🇦🇹", "LNZ": "🇦🇹", "SZG": "🇦🇹", "INN": "🇦🇹", "GRZ": "🇦🇹",
    // Others
    "BUD": "🇭🇺", "LUX": "🇱🇺", "BTS": "🇸🇰", "CRL": "🇧🇪", "BRU": "🇧🇪", "EHBD": "🇳🇱", "AMS": "🇳🇱", "ORK": "🇮🇪", "DUB": "🇮🇪",
    "PRG": "🇨🇿", "WAW": "🇵🇱", "ATH": "🇬🇷", "LIS": "🇵🇹", "FAO": "🇵🇹", "DWC": "🇦🇪", "DXB": "🇦🇪", "EDTY": "🇩🇪", "LEY": "🇳🇱"
  };

  if (code && flagMap[code]) {
    return flagMap[code];
  }

  // Fallback to string matching
  if (airportString.includes("London")) return "🇬🇧";
  if (airportString.includes("Paris") || airportString.includes("Nice") || airportString.includes("Angouleme") || airportString.includes("Toulouse") || airportString.includes("Cannes")) return "🇫🇷";
  if (airportString.includes("Geneva") || airportString.includes("Zurich")) return "🇨🇭";
  if (airportString.includes("New York") || airportString.includes("Los Angeles") || airportString.includes("Miami")) return "🇺🇸";
  if (airportString.includes("Dubai")) return "🇦🇪";
  if (airportString.includes("Budapest")) return "🇭🇺";
  if (airportString.includes("Ibiza") || airportString.includes("Palma")) return "🇪🇸";
  if (airportString.includes("Olbia") || airportString.includes("Bologna") || airportString.includes("Verona") || airportString.includes("Milan") || airportString.includes("Rome")) return "🇮🇹";
  if (airportString.includes("Cologne") || airportString.includes("Nuremberg") || airportString.includes("Munich") || airportString.includes("Schwabisch") || airportString.includes("Dortmund") || airportString.includes("Dusseldorf") || airportString.includes("Leipzig") || airportString.includes("Munster") || airportString.includes("Bremen") || airportString.includes("Stuttgart") || airportString.includes("Hamburg") || airportString.includes("Berlin") || airportString.includes("Frankfurt")) return "🇩🇪";
  if (airportString.includes("Lelystad") || airportString.includes("Amsterdam")) return "🇳🇱";
  
  return "";
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Fallback if invalid
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options); // e.g., "Jul 11, 2026"
}

export default function EmptyLegs() {
  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        // Fetch Supabase flights
        const supabasePromise = supabase
          .from('empty_legs')
          .select('*')
          .eq('status', 'available')
          .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy filter to force fresh fetch
          .order('created_at', { ascending: false });

        const { data: supabaseData, error } = await supabasePromise;

        let combinedFlights: any[] = [];

        if (supabaseData) {
          const now = new Date();
          const oneHourFromNow = new Date(now.getTime() + 1 * 60 * 60 * 1000);

          const validFlights = [];
          const expiredFlightIds = [];

          for (const flight of supabaseData) {
            if (flight.departure_date && flight.departure_time && flight.departure_time !== "TBD") {
              const flightDateTime = new Date(`${flight.departure_date} ${flight.departure_time}`);
              if (flightDateTime < oneHourFromNow) {
                expiredFlightIds.push(flight.id);
              } else {
                validFlights.push(flight);
              }
            } else if (flight.departure_date && flight.departure_time === "TBD") {
              const flightDate = new Date(flight.departure_date);
              flightDate.setHours(23, 59, 59, 999);
              if (flightDate < now) {
                expiredFlightIds.push(flight.id);
              } else {
                validFlights.push(flight);
              }
            } else {
              validFlights.push(flight);
            }
          }

          // Deduplicate flights based on route and time (within 5 minutes)
          const uniqueFlights = [];
          
          for (const flight of validFlights) {
            const depCode = flight.departure_airport?.match(/\(([^)]+)\)/)?.[1] || flight.departure_airport;
            const destCode = flight.destination_airport?.match(/\(([^)]+)\)/)?.[1] || flight.destination_airport;
            
            const isDuplicate = uniqueFlights.some(existing => {
              const exDepCode = existing.departure_airport?.match(/\(([^)]+)\)/)?.[1] || existing.departure_airport;
              const exDestCode = existing.destination_airport?.match(/\(([^)]+)\)/)?.[1] || existing.destination_airport;
              
              if (depCode !== exDepCode || destCode !== exDestCode) return false;
              if (flight.departure_date !== existing.departure_date) return false;
              
              // Parse times
              const timeA = (flight.departure_time && flight.departure_time !== 'TBD') ? flight.departure_time.split(' ')[0] : '00:00';
              const timeB = (existing.departure_time && existing.departure_time !== 'TBD') ? existing.departure_time.split(' ')[0] : '00:00';
              
              const dateA = new Date(`${flight.departure_date} ${timeA}`);
              const dateB = new Date(`${existing.departure_date} ${timeB}`);
              
              const diffMs = Math.abs(dateA.getTime() - dateB.getTime());
              const diffMins = diffMs / (1000 * 60);
              
              return diffMins <= 5;
            });
            
            if (!isDuplicate) {
              uniqueFlights.push(flight);
            } else {
              console.log(`Duplicate flight found and removed: ${flight.departure_airport} -> ${flight.destination_airport} at ${flight.departure_time}`);
            }
          }

          combinedFlights = uniqueFlights;

          if (expiredFlightIds.length > 0) {
            supabase
              .from('empty_legs')
              .delete()
              .in('id', expiredFlightIds)
              .then(({ error }) => {
                if (error) console.error("Error deleting expired flights:", error);
              });
          }
        }

        // Removed GlobeAir iCal fetch - all GlobeAir flights now come directly from the Supabase scraper

        // Sort combined flights by date
        combinedFlights.sort((a, b) => {
          const timeA = (a.departure_time && a.departure_time !== 'TBD') ? a.departure_time.split(' ')[0] : '00:00';
          const timeB = (b.departure_time && b.departure_time !== 'TBD') ? b.departure_time.split(' ')[0] : '00:00';
          const dateA = new Date(`${a.departure_date} ${timeA}`);
          const dateB = new Date(`${b.departure_date} ${timeB}`);
          return dateA.getTime() - dateB.getTime(); // Ascending order (soonest first)
        });

        setFlights(combinedFlights);
      } catch (error) {
        console.error("Error in fetchFlights:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter(flight =>
    (flight.departure_airport?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (flight.destination_airport?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (flight.aircraft_model?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={true} />

      {/* Header */}
      <section className="hero-header" style={{
        padding: "16rem 2rem 8rem",
        textAlign: "center",
        background: "linear-gradient(rgba(10, 17, 13, 0.85), var(--bg-primary)), url('/images/heavy_jet.png') center/cover",
        borderBottom: "1px solid rgba(212, 175, 55, 0.15)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            Global Database
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "3.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Empty Leg Flights
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "2rem" }}>
            Access the world's most exclusive repositioning flights. Book an entire private jet at up to 90% off the standard charter price. Operators upload their live availability below.
          </p>

          {/* Operator Registration CTA */}
          <div className="animate-fade-in-up delay-150" style={{ marginBottom: "2rem", fontSize: "1rem" }}>
            <span style={{ color: "var(--text-secondary)", marginRight: "0.5rem" }}>Are you a charter operator?</span>
            <Link href="/portal" style={{ color: "var(--accent-gold)", fontWeight: 600, textDecoration: "underline" }}>
              Upload your flights here →
            </Link>
          </div>

          {/* Search Box */}
          <div className="animate-fade-in-up delay-200" style={{ display: "flex", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by city, airport code, or aircraft..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "16px 24px",
                background: "rgba(10, 17, 13, 0.7)",
                border: "1px solid rgba(212, 175, 55, 0.5)",
                borderRight: "none",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "1rem"
              }}
            />
            <button className="desktop-only" style={{
              background: "var(--accent-gold)",
              color: "var(--bg-primary)",
              border: "1px solid var(--accent-gold)",
              padding: "0 24px",
              cursor: "pointer",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Filter
            </button>
          </div>
        </div>
      </section>

      {/* Database Table Section */}
      <section className="container" style={{ padding: "4rem 2rem 8rem", maxWidth: "1400px", margin: "0 auto", flex: 1 }}>

        {/* Mobile List (Visible only on mobile) */}
        <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>Loading live database...</div>
          ) : filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} style={{
                background: "rgba(10, 17, 13, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                padding: "1.2rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem"
              }}>
                {/* Row 1: Routing */}
                <div style={{ color: "var(--accent-gold)", fontWeight: 600, fontSize: "1.1rem" }}>
                  {getFlag(flight.departure_airport)} {getCityAndCode(flight.departure_airport)} → {getFlag(flight.destination_airport)} {getCityAndCode(flight.destination_airport)}
                </div>

                {/* Row 2: Date & Time */}
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {formatDate(flight.departure_date)} at {flight.departure_time}
                </div>
                
                {/* Row 3: Aircraft & Seats */}
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  <span style={{ fontWeight: 600 }}>{flight.aircraft_model}</span> &middot; {flight.seats} Seats
                  {(flight.pet_friendly || flight.wifi_available || flight.smoking_permitted) && " · "}
                  {flight.pet_friendly && <span style={{ marginRight: "0.2rem" }}>🐾</span>}
                  {flight.wifi_available && <span style={{ marginRight: "0.2rem" }}>📶</span>}
                  {flight.smoking_permitted && <span>🚬</span>}
                </div>
                
                {/* Row 4: Price & Action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "1.3rem", display: "flex", flexDirection: "column" }}>
                    <span>€{flight.net_price - (flight.vat_amount || 0) + flight.broker_fee}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 400 }}>Whole Aircraft</span>
                  </div>
                  <Link href={`/checkout/${flight.id}`} className="btn" style={{ padding: "8px 20px", fontSize: "0.8rem" }}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
              No empty legs found matching your search.
            </div>
          )}
        </div>

        {/* Desktop Table (Visible only on desktop) */}
        <div className="table-responsive-wrapper desktop-only">
          <div className="empty-legs-table-container">
            <table className="empty-legs-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Routing</th>
                  <th>Aircraft</th>
                  <th>Price (Whole Aircraft)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading live database...</td>
                  </tr>
                ) : filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <tr key={flight.id}>
                      <td data-label="Date">
                        <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{formatDate(flight.departure_date)}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{flight.departure_time}</div>
                      </td>
                      <td data-label="Routing">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                          <span style={{ color: "var(--accent-gold)" }}>{getFlag(flight.departure_airport)} {getCityAndCode(flight.departure_airport)}</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>→</span>
                          <span style={{ color: "var(--accent-gold)" }}>{getFlag(flight.destination_airport)} {getCityAndCode(flight.destination_airport)}</span>
                        </div>
                      </td>
                      <td data-label="Aircraft">
                        <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{flight.aircraft_model}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <span>{flight.seats} Seats</span>
                          {flight.pet_friendly && <span style={{ color: "var(--accent-gold)" }}>&middot; 🐾 Pets</span>}
                          {flight.wifi_available && <span style={{ color: "var(--accent-gold)" }}>&middot; 📶 Wi-Fi</span>}
                          {flight.smoking_permitted && <span style={{ color: "var(--accent-gold)" }}>&middot; 🚬 Smoking</span>}
                        </div>
                      </td>
                      <td data-label="Price">
                        <span className="price-discount">€{flight.net_price - (flight.vat_amount || 0) + flight.broker_fee}</span>
                      </td>
                      <td data-label="Status">
                        <span className="status-badge status-available">Available</span>
                      </td>
                      <td data-label="Action">
                        <Link
                          href={`/checkout/${flight.id}`}
                          className="btn"
                          style={{ padding: "10px 20px", fontSize: "0.8rem", display: "inline-block", whiteSpace: "nowrap" }}
                        >
                          Book Now
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                      No empty legs found matching your search. Try adjusting your filters or request a bespoke quote.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

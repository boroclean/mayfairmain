"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function EmptyLegs() {
  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      const { data, error } = await supabase
        .from('empty_legs')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (data) {
        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        
        const validFlights = [];
        const expiredFlightIds = [];

        for (const flight of data) {
          if (flight.departure_date && flight.departure_time && flight.departure_time !== "TBD") {
            const flightDateTime = new Date(`${flight.departure_date} ${flight.departure_time}`);
            if (flightDateTime < twoHoursFromNow) {
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

        setFlights(validFlights);

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
      setLoading(false);
    }
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter(flight => 
    flight.departure_airport.toLowerCase().includes(search.toLowerCase()) || 
    flight.destination_airport.toLowerCase().includes(search.toLowerCase()) ||
    flight.aircraft_model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={true} />

      {/* Header */}
      <section style={{ 
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
            Access the world's most exclusive repositioning flights. Book an entire private jet at up to 75% off the standard charter price. Operators upload their live availability below.
          </p>
          
          {/* Search Box */}
          <div className="animate-fade-in-up delay-200" style={{ display: "flex", maxWidth: "500px", margin: "0 auto" }}>
            <input 
              type="text" 
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
            <button style={{ 
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
      <section className="container" style={{ padding: "4rem 2rem 8rem", maxWidth: "1200px", margin: "0 auto", flex: 1 }}>
        <div className="table-responsive-wrapper">
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
                      <div style={{ fontWeight: 600 }}>{flight.departure_date}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{flight.departure_time} Local</div>
                    </td>
                    <td data-label="Routing">
                      <div style={{ fontWeight: 600, color: "var(--accent-gold)" }}>{flight.departure_airport}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0" }}>↓ to</div>
                      <div style={{ fontWeight: 600 }}>{flight.destination_airport}</div>
                    </td>
                    <td data-label="Aircraft">
                      <div style={{ fontWeight: 600 }}>{flight.aircraft_model}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "4px" }}>{flight.aircraft_category} &middot; {flight.seats} Seats</div>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", justifyContent: "flex-end" }}>
                        {flight.pet_friendly && <span style={{ color: "var(--accent-gold)" }}>🐾 Pets OK</span>}
                        {flight.wifi_available && <span style={{ color: "var(--accent-gold)" }}>📶 Wi-Fi</span>}
                        {flight.smoking_permitted && <span style={{ color: "var(--accent-gold)" }}>🚬 Smoking OK</span>}
                      </div>
                    </td>
                    <td data-label="Price">
                      <span className="price-discount">€{flight.net_price + flight.broker_fee}</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge status-available">Available</span>
                    </td>
                    <td data-label="Action">
                      <Link 
                        href={`/checkout/${flight.id}`} 
                        className="btn" 
                        style={{ padding: "10px 20px", fontSize: "0.8rem", display: "inline-block" }}
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

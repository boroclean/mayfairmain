"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function OperatorDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [operator, setOperator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile form state (for Google users who haven't filled it yet)
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [aocNumber, setAocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Flight form state
  const [depAirport, setDepAirport] = useState("");
  const [destAirport, setDestAirport] = useState("");
  const [depDate, setDepDate] = useState("");
  const [depTime, setDepTime] = useState("");
  const [aircraftModel, setAircraftModel] = useState("");
  const [seats, setSeats] = useState("4");
  const [netPrice, setNetPrice] = useState("");
  const [tailNumber, setTailNumber] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [uploading, setUploading] = useState(false);



  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/portal/login";
        return;
      }
      setUser(user);

      // Fetch operator profile
      const { data: operatorData } = await supabase
        .from('operators')
        .select('*')
        .eq('id', user.id)
        .single();

      setOperator(operatorData);
      setLoading(false);
    }
    checkUser();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('operators')
      .insert({
        id: user.id,
        company_name: companyName,
        contact_name: contactName,
        aoc_number: aocNumber,
        email: user.email,
        phone,
        website,
        status: 'pending'
      });

    if (error) {
      alert(error.message);
    } else {
      // Refresh data
      window.location.reload();
    }
    setLoading(false);
  };

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const price = parseFloat(netPrice);
    const brokerFee = Math.ceil((price * 0.10) / 10) * 10;

    const { error } = await supabase
      .from('empty_legs')
      .insert({
        departure_airport: depAirport,
        destination_airport: destAirport,
        departure_date: depDate,
        departure_time: depTime,
        aircraft_model: aircraftModel,
        seats: parseInt(seats),
        net_price: price,
        broker_fee: brokerFee,
        status: 'available',
        operator_id: user.id,
        tail_number: tailNumber,
        flight_number: flightNumber
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Flight uploaded successfully!");
      // Reset form
      setDepAirport("");
      setDestAirport("");
      setDepDate("");
      setDepTime("");
      setAircraftModel("");
      setSeats("4");
      setNetPrice("");
      setTailNumber("");
      setFlightNumber("");
    }
    setUploading(false);
  };

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-gold)", background: "var(--bg-primary)" }}>Loading Portal...</div>;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: "4rem 2rem" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "3rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--text-primary)" }}>Operator Portal</h1>
              <p style={{ color: "var(--text-secondary)" }}>Welcome, {user.email}</p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }} style={{ padding: "8px 16px", background: "transparent", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
              Sign Out
            </button>
          </div>

          {/* Case 1: No profile yet (Social Login users) */}
          {!operator && (
            <div style={{ background: "var(--bg-secondary)", padding: "2rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>Complete Your Profile</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Please provide your company details to apply for flight upload permissions.</p>
              
              <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Company Name *</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Contact Person Name *</label>
                    <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>AOC Number *</label>
                    <input type="text" value={aocNumber} onChange={e => setAocNumber(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Phone Number</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Website URL</label>
                  <input type="url" value={website} onChange={e => setWebsite(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <button type="submit" style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Submit Application
                </button>
              </form>
            </div>
          )}

          {/* Case 2: Pending Approval */}
          {operator && operator.status === 'pending' && (
            <div style={{ background: "var(--bg-secondary)", padding: "3rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>⏳</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Account Pending Approval</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Your application is currently being reviewed by our team. You will be able to upload flights once your account is approved.
              </p>
            </div>
          )}

          {/* Case 3: Approved - Show Flight Upload Form */}
          {operator && operator.status === 'approved' && (
            <div style={{ background: "var(--bg-secondary)", padding: "2rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem" }}>Upload Empty Leg Flight</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Fill in the details to list a new empty leg flight.</p>
              
              <form onSubmit={handleFlightSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Departure Airport *</label>
                    <input type="text" value={depAirport} onChange={e => setDepAirport(e.target.value)} placeholder="e.g. London Luton (LTN)" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Destination Airport *</label>
                    <input type="text" value={destAirport} onChange={e => setDestAirport(e.target.value)} placeholder="e.g. Paris Le Bourget (LBG)" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Departure Date *</label>
                    <input type="date" value={depDate} onChange={e => setDepDate(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Departure Time *</label>
                    <input type="time" value={depTime} onChange={e => setDepTime(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Aircraft Model *</label>
                    <input type="text" value={aircraftModel} onChange={e => setAircraftModel(e.target.value)} placeholder="e.g. Citation Mustang" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Seats *</label>
                    <input type="number" value={seats} onChange={e => setSeats(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Tail Number (Registration) *</label>
                    <input type="text" value={tailNumber} onChange={e => setTailNumber(e.target.value)} placeholder="e.g. G-MDSI" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Flight Number (Optional)</label>
                    <input type="text" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} placeholder="e.g. GA123" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Net Price (€) *</label>
                  <input type="number" value={netPrice} onChange={e => setNetPrice(e.target.value)} placeholder="Amount you want to receive" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>We will add a 10% broker fee to this price on the public listing.</span>
                </div>

                <button type="submit" disabled={uploading} style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "1rem" }}>
                  {uploading ? "Uploading..." : "Upload Flight"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

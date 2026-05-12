"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function OperatorRegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [aocNumber, setAocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [fleet, setFleet] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Create the operator profile
      const { error: profileError } = await supabase
        .from('operators')
        .insert({
          id: authData.user.id,
          company_name: companyName,
          contact_name: contactName,
          aoc_number: aocNumber,
          email,
          phone,
          website,
          status: 'pending' // Default status
        });

      if (profileError) {
        alert(profileError.message);
      } else {
        setSubmitted(true);
      }
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "var(--bg-secondary)", padding: "3rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)", maxWidth: "500px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>✓</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>Application Submitted</h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
              Thank you for applying to join the Mayfair & Main operator network. Our team will review your application and AOC certificate. You will receive an email once your account is approved.
            </p>
            <Link href="/" style={{ padding: "10px 20px", background: "var(--accent-gold)", color: "var(--bg-primary)", textDecoration: "none", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "3rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)", maxWidth: "600px", width: "100%" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Operator Registration</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Apply to upload your empty leg flights</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Website URL</label>
                <input type="url" value={website} onChange={e => setWebsite(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Fleet Details (Optional)</label>
                <input type="text" value={fleet} onChange={e => setFleet(e.target.value)} placeholder="e.g. 3 Light Jets" style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0.5rem 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Account Credentials</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Password *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "1rem" }}
            >
              {loading ? "Submitting..." : "Apply Now"}
            </button>
          </form>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>
            Already have an account? <Link href="/portal/login" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

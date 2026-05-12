"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function OperatorPortalPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [aocNumber, setAocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [expectedFlights, setExpectedFlights] = useState("1-5");
  const [submitted, setSubmitted] = useState(false);


  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/portal/dashboard`,
      }
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/portal/dashboard";
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign up the user
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
          expected_flights: expectedFlights,
          status: 'pending'
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
        <div style={{ background: "var(--bg-secondary)", padding: "3rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)", maxWidth: isLogin ? "400px" : "600px", width: "100%", transition: "max-width 0.3s ease" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Operator Portal</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {isLogin ? "Sign in to manage your flights" : "Apply to join our operator network"}
            </p>
          </div>

          {/* Toggle Button */}
          <div style={{ display: "flex", background: "rgba(10, 17, 13, 0.5)", borderRadius: "4px", padding: "4px", marginBottom: "2rem" }}>
            <button 
              onClick={() => setIsLogin(true)} 
              style={{ flex: 1, padding: "10px", background: isLogin ? "var(--accent-gold)" : "transparent", color: isLogin ? "var(--bg-primary)" : "var(--text-secondary)", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "2px", transition: "all 0.2s" }}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
              style={{ flex: 1, padding: "10px", background: !isLogin ? "var(--accent-gold)" : "transparent", color: !isLogin ? "var(--bg-primary)" : "var(--text-secondary)", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "2px", transition: "all 0.2s" }}
            >
              Register
            </button>
          </div>

          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "12px", 
              background: "white", 
              color: "#333", 
              border: "none", 
              borderRadius: "4px", 
              fontWeight: "bold", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px", 
              cursor: "pointer",
              marginBottom: "1.5rem"
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: "18px", height: "18px" }} />
            {loading ? "Connecting..." : isLogin ? "Sign in with Google" : "Apply with Google"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>or use email</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          {/* Forms */}
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
              <button type="submit" disabled={loading} style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.5rem" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Company Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Contact Name *</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>AOC Number</label>
                  <input type="text" value={aocNumber} onChange={e => setAocNumber(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Phone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Expected Flights Per Month</label>
                <select 
                  value={expectedFlights} 
                  onChange={e => setExpectedFlights(e.target.value)} 
                  style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }}
                >
                  <option value="1-5">1-5</option>
                  <option value="5-30">5-30</option>
                  <option value="30+">30+</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Password *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} required />
              </div>
              <button type="submit" disabled={loading} style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.5rem" }}>
                {loading ? "Submitting..." : "Apply Now"}
              </button>
            </form>
          )}

        </div>
      </div>
    </main>
  );
}

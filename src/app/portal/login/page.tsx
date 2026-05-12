"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function OperatorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "3rem", borderRadius: "8px", border: "1px solid rgba(212, 175, 55, 0.2)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
          
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Operator Portal</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>Sign in to manage your empty leg flights</p>

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
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} 
                required 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ padding: "10px", background: "rgba(10, 17, 13, 0.7)", border: "1px solid rgba(212, 175, 55, 0.3)", color: "var(--text-primary)", outline: "none" }} 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: "12px", background: "var(--accent-gold)", color: "var(--bg-primary)", border: "none", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.5rem" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "1.5rem" }}>
            Don't have an account? <Link href="/portal/register" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>Apply here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

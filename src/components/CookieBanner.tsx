"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on first render
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 4rem)",
      maxWidth: "760px",
      background: "rgba(10, 17, 13, 0.97)",
      border: "1px solid rgba(212, 175, 55, 0.3)",
      borderRadius: "4px",
      padding: "1.5rem 2rem",
      zIndex: 9999,
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      flexWrap: "wrap",
      animation: "slideUp 0.4s ease",
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Gold accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)"
      }} />

      <div style={{ flex: 1, minWidth: "240px" }}>
        <p style={{ color: "var(--text-primary)", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
          We use cookies to enhance your experience. Essential cookies are always active.{" "}
          <Link href="/privacy" style={{ color: "var(--accent-gold)", textDecoration: "underline" }}>
            Privacy Policy
          </Link>
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
        <button
          onClick={acceptEssential}
          style={{
            background: "transparent",
            border: "1px solid rgba(212,175,55,0.4)",
            color: "var(--text-secondary)",
            padding: "0.5rem 1.2rem",
            fontSize: "0.8rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            transition: "all 0.2s",
            borderRadius: "2px",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)")}
        >
          Essential Only
        </button>
        <button
          onClick={acceptAll}
          style={{
            background: "var(--accent-gold)",
            border: "1px solid var(--accent-gold)",
            color: "#0a110d",
            padding: "0.5rem 1.2rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            transition: "all 0.2s",
            borderRadius: "2px",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}

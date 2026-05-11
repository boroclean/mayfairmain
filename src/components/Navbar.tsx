"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ isTransparent = false }: { isTransparent?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Nav is solid if: menu is open, OR user has scrolled, OR page has no hero bg
  const isSolid = isOpen || scrolled || !isTransparent;

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem 2rem",
        background: isSolid
          ? "rgba(10, 17, 13, 0.97)"
          : "linear-gradient(to bottom, rgba(10,17,13,0.7), transparent)",
        borderBottom: isSolid ? "1px solid rgba(212, 175, 55, 0.2)" : "none",
        backdropFilter: isSolid ? "blur(12px)" : "none",
        boxSizing: "border-box" as const,
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", letterSpacing: "0.1em", color: "var(--accent-gold)", textDecoration: "none", flexShrink: 0 }}>
          MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.1rem" }}>&</span> MAIN
        </Link>

        {/* Desktop Links */}
        <div className="desktop-menu" style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" as const, alignItems: "center" }}>
          <Link href="/how-it-works" style={{ color: "var(--text-primary)", textDecoration: "none" }}>How it Works</Link>
          <Link href="/empty-legs" style={{ color: "var(--text-primary)", textDecoration: "none" }}>Empty Legs</Link>
          <Link href="/services" style={{ color: "var(--text-primary)", textDecoration: "none" }}>Services</Link>
          <Link href="/heritage" style={{ color: "var(--text-primary)", textDecoration: "none" }}>Heritage</Link>
          <Link href="/quote" className="btn" style={{ padding: "8px 24px" }}>Inquire</Link>
        </div>

        {/* Hamburger — visibility controlled purely via CSS */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {isOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div style={{
          position: "fixed",
          top: "65px",
          left: 0,
          right: 0,
          zIndex: 9998,
          background: "rgba(10, 17, 13, 0.98)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
          padding: "1.5rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
        }}>
          <Link href="/how-it-works" onClick={() => setIsOpen(false)} style={{ fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-primary)", textDecoration: "none", padding: "0.5rem 0" }}>How it Works</Link>
          <Link href="/empty-legs" onClick={() => setIsOpen(false)} style={{ fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-primary)", textDecoration: "none", padding: "0.5rem 0" }}>Empty Legs</Link>
          <Link href="/services" onClick={() => setIsOpen(false)} style={{ fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-primary)", textDecoration: "none", padding: "0.5rem 0" }}>Services</Link>
          <Link href="/heritage" onClick={() => setIsOpen(false)} style={{ fontSize: "1.1rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-primary)", textDecoration: "none", padding: "0.5rem 0" }}>Heritage</Link>
          <Link href="/quote" onClick={() => setIsOpen(false)} className="btn" style={{ textAlign: "center", marginTop: "0.5rem" }}>Inquire</Link>
        </div>
      )}

      {/* Spacer so fixed nav doesn't hide page content on non-hero pages */}
      {!isTransparent && <div style={{ height: "69px" }} />}
    </>
  );
}

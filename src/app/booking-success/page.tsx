"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    if (sessionId) setStatus("success");
  }, [sessionId]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar isTransparent={false} />

      <section style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(212,175,55,0.2)",
          padding: "4rem 3rem",
          position: "relative",
        }}>
          {/* Gold top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)"
          }} />

          {/* Checkmark */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "2px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2rem",
          }}>
            ✓
          </div>

          <h1 style={{
            fontFamily: "var(--font-heading)",
            color: "var(--accent-gold)",
            fontSize: "2rem",
            marginBottom: "1rem",
          }}>
            Booking Confirmed
          </h1>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            Your payment was successful. A confirmation has been sent to your email address.
          </p>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.9rem" }}>
            Our team will contact you within <span style={{ color: "var(--accent-gold)" }}>2 hours</span> to confirm the final details of your flight.
          </p>

          <div style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.15)",
            padding: "1.25rem",
            marginBottom: "2.5rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}>
            <strong style={{ color: "var(--accent-gold)" }}>What happens next?</strong><br />
            1. We notify the operator to hold the aircraft<br />
            2. You receive a Charter Agreement to sign<br />
            3. Flight details confirmed 24h before departure
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/empty-legs" className="btn" style={{
              background: "transparent",
              borderColor: "rgba(212,175,55,0.4)",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
            }}>
              Browse More Flights
            </Link>
            <Link href="/" className="btn" style={{ fontSize: "0.85rem" }}>
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <SuccessContent />
    </Suspense>
  );
}

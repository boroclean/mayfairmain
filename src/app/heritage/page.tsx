import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Heritage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={true} />

      {/* Hero Section */}
      <section style={{ 
        padding: "16rem 2rem 8rem",
        textAlign: "center",
        background: "linear-gradient(rgba(10, 17, 13, 0.85), var(--bg-primary)), url('/images/yacht.png') center/cover",
        position: "relative"
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            Our Philosophy
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "4rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Uncompromising Excellence
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="container" style={{ padding: "4rem 2rem 8rem", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
          
          {/* The Broker Advantage */}
          <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <h2 style={{ color: "var(--accent-gold)", fontSize: "2.5rem", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>The Broker Advantage</h2>
              <div style={{ width: "60px", height: "2px", background: "var(--accent-gold)", marginBottom: "2rem" }}></div>
            </div>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Unlike operators restricted by their own limited fleets, Mayfair & Main operates as an independent luxury brokerage. This fundamental distinction guarantees that our allegiance is exclusively to you, the client.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                By maintaining a curated network of the world's finest aircraft operators, we possess the agility to source the exact aircraft for your specific mission—whether it's a Light Jet for a quick hop to Geneva or an Ultra-Long Range Jet for a transatlantic crossing. We ensure complete transparency, unmatched safety standards, and optimal pricing.
              </p>
            </div>
          </div>

          {/* Heritage & Vision */}
          <div className="mobile-stack-reverse" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Founded on the principles of classic British hospitality and discreet service, Mayfair & Main is more than a charter agency. We are your dedicated travel advisors. 
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                Every itinerary is assigned a single, dedicated broker available 24/7. From the moment you request a quote to the minute you arrive at your final destination, we orchestrate every detail—ground transfers, bespoke catering, and specific crew requests—with military precision.
              </p>
            </div>
            <div>
              <h2 style={{ color: "var(--accent-gold)", fontSize: "2.5rem", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>A Legacy of Trust</h2>
              <div style={{ width: "60px", height: "2px", background: "var(--accent-gold)", marginBottom: "2rem" }}></div>
            </div>
          </div>

        </div>

      </section>

      {/* CTA Section */}
      <section style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem" }}>Experience the Difference</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2.5rem", fontSize: "1.1rem" }}>
          Allow us to demonstrate the value of independent brokerage on your next flight.
        </p>
        <Link href="/quote" className="btn" style={{ padding: "16px 40px", fontSize: "1rem" }}>Contact Your Broker</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

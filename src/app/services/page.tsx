import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Services() {
  const services = [
    {
      title: "On-Demand Charter",
      description: "Access to a vetted global network of 5000+ jets. We match the perfect aircraft to your exact mission requirements, ensuring absolute privacy and safety.",
      icon: "🛩️",
    },
    {
      title: "VIP Concierge",
      description: "From tarmac chauffeur transfers in a Rolls-Royce to Michelin-starred in-flight catering and exclusive hotel reservations, we manage every detail of your journey.",
      icon: "🛎️",
    },
    {
      title: "Empty Leg Flights",
      description: "Take advantage of heavily discounted repositioning flights. Experience uncompromising luxury at exceptional value for flexible travel itineraries.",
      icon: "🏷️",
    },
    {
      title: "Helicopter Transfers",
      description: "Bypass traffic and delays. We arrange seamless helicopter transfers from your private jet terminal directly to city centers, ski resorts, or your yacht.",
      icon: "🚁",
    },
    {
      title: "Medical Evacuation",
      description: "Rapid-response, highly specialized air ambulance services for urgent medical transport, ensuring the highest level of care and discretion.",
      icon: "🚑",
    },
    {
      title: "High-Value Cargo",
      description: "Secure, discrete, and expedited transport for fine art, jewelry, sensitive corporate documents, and other irreplaceable assets.",
      icon: "💎",
    }
  ];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar isTransparent={true} />

      {/* Hero Section */}
      <section className="hero-header" style={{ 
        padding: "16rem 2rem 8rem",
        textAlign: "center",
        background: "linear-gradient(rgba(10, 17, 13, 0.85), var(--bg-primary)), url('/images/jet_interior.png') center/cover",
        position: "relative"
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            Bespoke Offerings
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "3.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Beyond the Flight
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Mayfair & Main provides an ecosystem of luxury. From securing the ideal aircraft to orchestrating every ground detail, our services are tailored to the world's most discerning travelers.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ padding: "4rem 2rem 8rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "3rem",
          marginTop: "2rem"
        }}>
          {services.map((service, index) => (
            <div key={index} style={{ background: "rgba(10, 17, 13, 0.8)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "2rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ fontSize: "3rem", background: "rgba(212, 175, 55, 0.1)", width: "64px", height: "64px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%" }}>
                  {service.icon}
                </div>
                <h3 style={{ color: "var(--accent-gold)", fontSize: "1.5rem", fontFamily: "var(--font-heading)", margin: 0 }}>
                  {service.title}
                </h3>
              </div>
              <div style={{ padding: "2rem", background: "rgba(212, 175, 55, 0.02)", flex: 1 }}>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem" }}>Curate Your Journey</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2.5rem", fontSize: "1.1rem" }}>
          Contact our dedicated brokers to discuss your unique travel requirements. We are available 24/7 to facilitate your next mission.
        </p>
        <Link href="/quote" className="btn" style={{ padding: "16px 40px", fontSize: "1rem" }}>Speak with a Broker</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

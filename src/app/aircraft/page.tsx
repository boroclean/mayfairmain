import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Aircraft() {
  const categories = [
    {
      title: "Very Light Jets (VLJ)",
      description: "The entry-level category, ideal for short-haul trips (1-2 hour flights) and smaller airports where large jets cannot land.",
      passengers: "4–5",
      examples: "Cessna Citation Mustang, Embraer Phenom 100",
      features: "Lower operating costs, no separate galley or flight attendant.",
      image: "/images/vlj_jet.png"
    },
    {
      title: "Light Jets",
      description: "The most popular choice for domestic or intra-European routes (e.g., Budapest–London).",
      passengers: "6–8",
      examples: "Nextant 400XTi, Embraer Phenom 300",
      features: "Faster and more spacious than VLJs, often equipped with a small lavatory.",
      image: "/images/light_jet.png"
    },
    {
      title: "Midsize Jets",
      description: "Suitable for longer, 4-5 hour journeys where full stand-up cabin height is expected.",
      passengers: "7–9",
      examples: "Hawker 800XP, Cessna Citation Latitude",
      features: "More comfortable seating, larger baggage capacity, and stewardess service available upon request.",
      image: "/images/midsize_jet.png"
    },
    {
      title: "Super Midsize Jets",
      description: "The golden mean between luxury and efficiency. Capable of cross-continental flights or even transoceanic routes under certain conditions.",
      passengers: "8–10",
      examples: "Bombardier Challenger 350, Gulfstream G280",
      features: "High cruising speed, exceptionally quiet cabin, and advanced entertainment systems.",
      image: "/images/jet_interior.png"
    },
    {
      title: "Heavy & Ultra-Long Range Jets",
      description: "The favorites of Mayfair & Main caliber agencies. These represent the absolute pinnacle of luxury, capable of non-stop global travel (e.g., London–Singapore).",
      passengers: "10–19",
      examples: "Gulfstream G650, Bombardier Global 7500",
      features: "Separate bedrooms, showers, full-service galleys, and gourmet catering.",
      image: "/images/heavy_jet.png"
    },
    {
      title: "Bizliners (Executive Airliners)",
      description: "Converted commercial airliners (like Boeing or Airbus) completely retrofitted for exclusive private use.",
      passengers: "19–50+",
      examples: "Airbus ACJ, Boeing BBJ",
      features: "Boardrooms, master suites, cinemas, and up to 100+ square meters of living space.",
      image: "/images/bizliner.png"
    }
  ];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={true} />

      {/* Header */}
      <section style={{ 
        padding: "16rem 2rem 8rem",
        textAlign: "center",
        background: "var(--bg-primary)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.15)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            Global Access
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "3.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Aircraft Categories
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>
            As independent brokers, we source the exact aircraft category that perfectly aligns with your mission's range, passenger count, and luxury requirements.
          </p>
        </div>
      </section>

      {/* Categories List */}
      <section className="container" style={{ padding: "4rem 2rem 8rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
          {categories.map((cat, index) => (
            <div key={index} style={{
              display: "flex",
              flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              gap: "4rem",
              alignItems: "center",
              background: "var(--bg-secondary)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
            }}>
              
              <div style={{ flex: 1, position: "relative", minHeight: "400px", width: "100%", height: "100%" }}>
                 <Image 
                   src={cat.image} 
                   alt={cat.title} 
                   fill 
                   style={{ objectFit: "cover", filter: "brightness(0.85)" }} 
                 />
              </div>

              <div style={{ flex: 1, padding: "3rem" }}>
                <h3 style={{ fontSize: "2rem", color: "var(--accent-gold)", marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>{cat.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>{cat.description}</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div>
                    <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Passengers</span>
                    <strong style={{ color: "var(--text-primary)", fontSize: "1.1rem" }}>{cat.passengers}</strong>
                  </div>
                  <div>
                    <span style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Key Features</span>
                    <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem", lineHeight: 1.4 }}>{cat.features}</strong>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(212, 175, 55, 0.15)", paddingTop: "1.5rem" }}>
                  <span style={{ display: "block", color: "var(--accent-gold)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Representative Aircraft</span>
                  <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{cat.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem" }}>Ready to Fly?</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2.5rem", fontSize: "1.1rem" }}>
          Let our brokers find the perfect aircraft for your upcoming journey.
        </p>
        <Link href="/quote" className="btn" style={{ padding: "16px 40px", fontSize: "1rem" }}>Request a Quote</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

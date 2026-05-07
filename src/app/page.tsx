import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar isTransparent={true} />

      {/* Hero Section */}
      <section style={{ 
        flex: 1, 
        minHeight: "95vh",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        textAlign: "center",
        padding: "0 2rem",
        background: "linear-gradient(rgba(10, 17, 13, 0.7), rgba(10, 17, 13, 0.9)), url('/images/heavy_jet.png') center/cover",
        position: "relative"
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            Est. 2026
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "4rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            Bespoke Aviation & <br /> Maritime Charters
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "3rem" }}>
            Experience the pinnacle of global travel. As premier charter brokers, we source the perfect private jets and luxury yachts from an exclusive, vetted worldwide network.
          </p>
          <div className="animate-fade-in-up delay-200" style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            <Link href="/quote" className="btn">Request a Quote</Link>
            <a href="#categories" className="btn" style={{ background: "transparent", borderColor: "var(--text-secondary)", color: "var(--text-secondary)" }}>View Categories</a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container" style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)" }}>The Heritage of Luxury</h2>
        <div style={{ width: "60px", height: "2px", background: "var(--accent-gold)", margin: "2rem auto" }}></div>
        <p style={{ maxWidth: "700px", margin: "0 auto", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Rooted in the timeless elegance of classic British luxury, Mayfair & Main offers an unparalleled charter experience. Whether ascending to the skies or navigating the seas, our commitment to discretion, safety, and bespoke service remains absolute.
        </p>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container" style={{ padding: "4rem 2rem 8rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem" }}>Global Aircraft Access</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>We secure the ideal aircraft for your specific mission, anywhere in the world.</p>
        </div>

        <div className="grid">
          {/* Card 1 */}
          <div className="card">
            <div className="card-image-container">
              <Image src="/images/heavy_jet.png" alt="Heavy Jet Exterior" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="card-content">
              <h3>Heavy Jets</h3>
              <p>Ultra-long range capabilities with uncompromising comfort for global travel.</p>
              <a href="#" className="text-gold" style={{ textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em" }}>View Category →</a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="card-image-container">
              <Image src="/images/jet_interior.png" alt="Luxury Jet Interior" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="card-content">
              <h3>Bespoke Interiors</h3>
              <p>Experience true heritage luxury at 40,000 feet. Tailored to your exact requirements.</p>
              <a href="#" className="text-gold" style={{ textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em" }}>Discover Service →</a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="card-image-container">
              <Image src="/images/yacht.png" alt="Superyacht" fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="card-content">
              <h3>Superyachts</h3>
              <p>Extend your journey to the seas with our handpicked selection of luxury yachts.</p>
              <a href="#" className="text-gold" style={{ textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em" }}>View Vessels →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

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

      {/* The Mayfair Standard Section */}
      <section style={{ padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <div className="container" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", fontFamily: "var(--font-heading)" }}>The Mayfair Standard</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem", maxWidth: "600px", margin: "1rem auto 0" }}>
            We redefine private aviation with a commitment to absolute excellence.
          </p>
        </div>

        <div className="container" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "3rem" 
        }}>
          {/* Item 1 */}
          <div style={{ textAlign: "center", padding: "2rem", background: "rgba(10, 17, 13, 0.4)", border: "1px solid rgba(212, 175, 55, 0.1)", borderRadius: "8px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛡️</div>
            <h3 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem", fontSize: "1.3rem" }}>Safety & Discretion</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              We only work with audited operators that meet the highest international safety standards. Your privacy is guaranteed.
            </p>
          </div>

          {/* Item 2 */}
          <div style={{ textAlign: "center", padding: "2rem", background: "rgba(10, 17, 13, 0.4)", border: "1px solid rgba(212, 175, 55, 0.1)", borderRadius: "8px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌍</div>
            <h3 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem", fontSize: "1.3rem" }}>Global Network</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Access over 5,000 aircraft worldwide. From light jets to executive airliners, we source the perfect aircraft for any mission.
            </p>
          </div>

          {/* Item 3 */}
          <div style={{ textAlign: "center", padding: "2rem", background: "rgba(10, 17, 13, 0.4)", border: "1px solid rgba(212, 175, 55, 0.1)", borderRadius: "8px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛩️</div>
            <h3 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem", fontSize: "1.3rem" }}>Bespoke Service</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Every detail is tailored to your preferences. From specific catering to ground transport, we manage it all seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Live Empty Legs Section */}
      <section style={{ padding: "6rem 2rem", background: "var(--bg-primary)" }}>
        <div className="container" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", fontFamily: "var(--font-heading)" }}>Live Empty Legs</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
            Exclusive repositioning flights at exceptional value.
          </p>
        </div>

        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ 
            background: "rgba(10, 17, 13, 0.6)", 
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(212, 175, 55, 0.2)", 
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "800px",
            margin: "0 auto 3rem"
          }}>
            <p style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
              Explore our real-time database of available empty leg flights.
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem" }}>
              Save up to 75% on standard charter prices.
            </p>
            <Link href="/empty-legs" className="btn" style={{ padding: "14px 35px" }}>
              View Available Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.1)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1rem", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>
            The Mayfair Experience
          </h2>
          
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 1.5rem", border: "2px solid var(--accent-gold)", position: "relative" }}>
            <Image src="/images/testimonial_client_man.png" alt="Alexander Vance" fill style={{ objectFit: "cover" }} />
          </div>

          <blockquote style={{ fontSize: "1.8rem", fontFamily: "var(--font-heading)", color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "2rem" }}>
            "An absolute masterclass in luxury travel. Discretion, speed, and perfection in every detail."
          </blockquote>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "1.1rem" }}>Alexander Vance</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>CEO, Vance Global Holdings</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)", padding: "4rem 2rem", textAlign: "center", marginTop: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)", fontSize: "1.5rem", marginBottom: "1rem" }}>MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.2rem" }}>&</span> MAIN</h2>
        
        {/* Legal Links */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
          <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/privacy#cookies" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Cookie Policy</Link>
        </div>

        {/* Disclaimer */}
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.5rem", maxWidth: "600px", margin: "0 auto 0.5rem", lineBreak: "strict" }}>
          Mayfair & Main acts as an agent/broker and does not own or operate aircraft. All flights are operated by fully licensed direct air carriers.
        </p>
        
        {/* Company Info */}
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "1rem" }}>
          Registered in Hungary &middot; Company No. [Placeholder] &middot; contact@mayfairandmain.com
        </p>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>&copy; 2026 Mayfair & Main Charter. All rights reserved.</p>
      </footer>
    </main>
  );
}

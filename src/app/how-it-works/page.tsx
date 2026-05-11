import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "The Bespoke Inquiry",
      subtitle: "Initiate your journey on your terms.",
      description: "Contact us via our online form, direct email, or WhatsApp. Share your preferred departure and destination points, dates, number of passengers, and any specific aircraft preferences or special requirements you may have (e.g., pets, specific catering, or ground transport).",
      details: "Our team is available 24/7 to receive your request. We understand that luxury travel requires immediate attention, and we aim to respond to all inquiries within minutes with an initial confirmation."
    },
    {
      number: "02",
      title: "Global Market Sourcing",
      subtitle: "We search the world to find your perfect match.",
      description: "As independent brokers, we are not limited to a fixed fleet. We leverage our exclusive, vetted network of global operators to find aircraft that perfectly match your mission profile, safety standards, and aesthetic preferences.",
      details: "We check real-time availability and negotiate directly with operators to secure the most competitive rates. Every operator we source is audited for safety, insurance, and service quality."
    },
    {
      number: "03",
      title: "Curated Proposals",
      subtitle: "Transparent options tailored to you.",
      description: "We present you with a curated selection of aircraft options (typically 3-4 distinct choices) with full transparency on costs, aircraft age, interior photos, and flight times.",
      details: "Each proposal includes an all-inclusive price with no hidden fees. We explain the pros and cons of each option based on your specific needs (e.g., luggage capacity, stand-up cabin height, or non-stop range)."
    },
    {
      number: "04",
      title: "Personalized Customization",
      subtitle: "Every detail aligned with your preferences.",
      description: "Once you select your preferred option, we begin tailoring the experience. From specific catering from your favorite restaurant to arranging luxury ground transport or helicopter transfers at either end.",
      details: "We manage all flight manifests, customs documentation, and special requests. Whether you need a specific brand of champagne on board or a pet-friendly cabin setup, our concierge team handles it seamlessly."
    },
    {
      number: "05",
      title: "Seamless Departure",
      subtitle: "Bypass the queues, embrace the skies.",
      description: "Arrive at the private terminal (FBO) just 15-20 minutes before your scheduled departure. You will be greeted by the crew and escorted directly to your aircraft with absolute discretion.",
      details: "No long security lines, no waiting. Your luggage is loaded directly from your car to the plane. Customs and immigration are handled quickly and discreetly in the private lounge or even on board."
    },
    {
      number: "06",
      title: "Post-Flight Support",
      subtitle: "Your journey continues on the ground.",
      description: "Upon arrival, should you require it, we can arrange for ground transport to be waiting on the tarmac (where permitted) or immediately outside the terminal to take you to your final destination.",
      details: "We follow up with you to ensure every aspect of the flight met your expectations. Your feedback is used to further personalize your future journeys with Mayfair & Main."
    }
  ];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={true} />

      {/* Hero Section */}
      <section style={{ 
        padding: "16rem 2rem 8rem",
        textAlign: "center",
        background: "linear-gradient(rgba(10, 17, 13, 0.85), var(--bg-primary)), url('/images/how_it_works_hero.png') center/cover",
        position: "relative"
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="desktop-only animate-fade-in-up" style={{ color: "var(--accent-gold)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
            The Process
          </h2>
          <h1 className="animate-fade-in-up" style={{ fontSize: "3.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            How It Works
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Experience the simplicity of ultra-luxury travel. We manage every detail from inquiry to arrival, ensuring a seamless and bespoke journey.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
          
          {/* Vertical Line */}
          <div style={{ 
            position: "absolute", 
            left: "20px", 
            top: "0", 
            bottom: "0", 
            width: "2px", 
            background: "linear-gradient(to bottom, var(--accent-gold), rgba(212, 175, 55, 0.1))" 
          }} />

          {steps.map((step, index) => (
            <div key={index} style={{ 
              display: "flex", 
              gap: "2rem", 
              marginBottom: "5rem",
              position: "relative"
            }}>
              {/* Number/Node */}
              <div style={{ 
                width: "42px", 
                height: "42px", 
                borderRadius: "50%", 
                background: "var(--bg-primary)", 
                border: "2px solid var(--accent-gold)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--accent-gold)",
                fontWeight: 600,
                fontSize: "0.9rem",
                flexShrink: 0,
                zIndex: 2,
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)"
              }}>
                {step.number}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>
                  {step.title}
                </h3>
                <h4 style={{ fontSize: "1rem", color: "var(--accent-gold)", marginBottom: "1rem", fontWeight: 400, fontStyle: "italic" }}>
                  {step.subtitle}
                </h4>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem", fontSize: "1.05rem" }}>
                  {step.description}
                </p>
                <div style={{ 
                  background: "rgba(212, 175, 55, 0.05)", 
                  padding: "1.5rem", 
                  borderRadius: "8px", 
                  borderLeft: "3px solid var(--accent-gold)"
                }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    <strong>Behind the Scenes:</strong> {step.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-secondary)", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem" }}>Begin Your Journey</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2.5rem", fontSize: "1.1rem" }}>
          Contact our dedicated brokers to discuss your upcoming travel requirements. We are available 24/7.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <Link href="/quote" className="btn" style={{ padding: "16px 40px", fontSize: "1rem" }}>Inquire Now</Link>
          <a href="https://wa.me/36706296818" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "transparent", borderColor: "var(--text-secondary)", color: "var(--text-secondary)", padding: "16px 40px", fontSize: "1rem" }}>
            WhatsApp Us
          </a>
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

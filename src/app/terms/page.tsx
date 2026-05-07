import Link from "next/link";

export default function LegalTermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <nav style={{ padding: "2rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", background: "var(--bg-secondary)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--accent-gold)" }}>
          MAYFAIR <span style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>&</span> MAIN
        </Link>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "2rem", fontFamily: "var(--font-heading)" }}>Legal Agreements & Terms</h1>
        
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: 1.6 }}>
          By using the Mayfair & Main platform, whether as a Charterer (Client) or an Operator (Carrier), you agree to the following terms and conditions.
        </p>

        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.5rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>1. Empty Leg Booking Terms (Clients)</h2>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p><strong>1.1 Agency Status:</strong> Mayfair & Main acts solely as an authorized agent/broker arranging the flight on behalf of the client. We are not a direct air carrier and do not operate aircraft.</p>
            <p><strong>1.2 Soft Hold Authorization:</strong> A non-refundable authorization of €2,000 is required to secure the routing request. If the requested aircraft is unavailable, the hold is released immediately.</p>
            <p><strong>1.3 Primary Flight Dependency:</strong> Empty Legs are strictly contingent upon the execution of the primary charter flight. The Operator reserves the right to cancel or alter the Empty Leg without prior notice if the primary flight is delayed, altered, or canceled.</p>
            <p><strong>1.4 Cancellation Remedy:</strong> In the event of an Empty Leg cancellation by the Operator, Mayfair & Main's sole liability to the Charterer shall be a full refund of all monies paid. We are not liable for consequential damages or alternative travel arrangements.</p>
          </div>
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.5rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>2. B2B Operator Terms (Carriers)</h2>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p><strong>2.1 Net Price Guarantee:</strong> By uploading an Empty Leg to the Mayfair & Main database, the Operator guarantees the submitted "Net Price" is valid and available for booking.</p>
            <p><strong>2.2 Operational Responsibility:</strong> The Operator assumes all legal and financial responsibility for EASA/FAA compliance, aircraft maintenance, crew licensing, and passenger safety.</p>
            <p><strong>2.3 Broker Commission:</strong> Mayfair & Main reserves the right to add a brokerage markup to the Operator's Net Price. Upon successful execution of the flight, Mayfair & Main will remit the exact Net Price to the Operator via wire transfer.</p>
          </div>
        </section>

      </div>
    </main>
  );
}

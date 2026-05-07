import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Privacy Policy | Mayfair & Main",
  description: "Privacy Policy and Data Protection Information for Mayfair & Main Charter Services.",
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar isTransparent={false} />

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem 6rem" }}>
        <h1 style={{ color: "var(--accent-gold)", fontFamily: "var(--font-heading)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem", fontSize: "0.9rem" }}>
          Last updated: May 2026
        </p>

        {[
          {
            title: "1. Data Controller",
            content: `Mayfair & Main Charter ("we", "us", or "our") is the data controller responsible for your personal data. For any data protection inquiries, please contact us at privacy@mayfairandmain.com.`
          },
          {
            title: "2. What Data We Collect",
            content: `We collect the following personal data when you use our services:
• Contact information: full name, email address, phone number
• Travel preferences: departure and destination airports, travel dates, number of passengers
• Communication records: any correspondence sent through our inquiry or booking forms
• Technical data: IP address, browser type, pages visited (via cookies)`
          },
          {
            title: "3. Legal Basis for Processing",
            content: `We process your personal data on the following legal bases under GDPR Article 6:
• Contractual necessity: to provide charter brokerage services you have requested
• Legitimate interests: to improve our services and communicate relevant offers
• Legal obligation: to comply with applicable aviation and financial regulations
• Consent: for marketing communications and non-essential cookies`
          },
          {
            title: "4. How We Use Your Data",
            content: `Your personal data is used to:
• Process charter flight inquiries and bookings
• Communicate flight details, quotes, and confirmations
• Send service-related notifications
• Comply with legal and regulatory requirements
• Improve our website and services`
          },
          {
            title: "5. Data Sharing",
            content: `We share your data only where necessary:
• Charter operators: to fulfil your booking, relevant flight details are shared with the operating airline
• Service providers: Supabase (database), Resend (email delivery), Vercel (hosting) — all GDPR compliant
• Legal authorities: when required by law

We do not sell your personal data to third parties.`
          },
          {
            title: "6. Data Retention",
            content: `We retain your personal data for:
• Inquiry data: 12 months from the date of inquiry
• Booking data: 7 years (for accounting and legal compliance)
• Marketing data: until you withdraw consent

You may request deletion of your data at any time, subject to legal retention obligations.`
          },
          {
            title: "7. Your Rights",
            content: `Under GDPR, you have the right to:
• Access: request a copy of the data we hold about you
• Rectification: correct any inaccurate or incomplete data
• Erasure: request deletion of your data ("right to be forgotten")
• Restriction: limit how we process your data
• Portability: receive your data in a machine-readable format
• Objection: object to processing based on legitimate interests
• Withdraw consent: at any time for consent-based processing

To exercise any of these rights, contact us at privacy@mayfairandmain.com. You also have the right to lodge a complaint with your national data protection authority (in Hungary: NAIH — naih.hu).`
          },
          {
            title: "8. Cookies",
            content: `We use the following types of cookies:
• Essential cookies: required for the website to function (no consent needed)
• Analytics cookies: help us understand how visitors use our site (consent required)

You can manage your cookie preferences at any time using the cookie settings banner on our website. For more information, see our Cookie Policy section below.`
          },
          {
            title: "9. Security",
            content: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. Our data is stored on EU-compliant infrastructure (Supabase, hosted on AWS EU regions).`
          },
          {
            title: "10. Changes to This Policy",
            content: `We may update this Privacy Policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of our services after changes constitutes acceptance of the updated policy.`
          },
          {
            title: "11. Contact",
            content: `For any privacy-related questions or to exercise your rights:
Email: privacy@mayfairandmain.com
Company: Mayfair & Main Charter
Website: mayfairandmain.com`
          }
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: "2.5rem", borderBottom: "1px solid rgba(212,175,55,0.1)", paddingBottom: "2.5rem" }}>
            <h2 style={{ color: "var(--accent-gold)", fontSize: "1.1rem", marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>
              {section.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line", fontSize: "0.95rem" }}>
              {section.content}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}

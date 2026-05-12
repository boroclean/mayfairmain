"use client";

import Link from "next/link";

export default function InsurancePolicyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", background: "var(--bg-secondary)", padding: "4rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>CANCELLATION INSURANCE POLICY</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Refundable Booking Terms & Conditions</p>
        </div>

        {/* Intro */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            You may be eligible to receive a refund if you cannot attend your booking due to any of the reasons listed below, and you have provided us with the evidence requested.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
            (Certain words in this document are in <strong>bold</strong> for clarity, and their meanings have been defined later in this document)
          </p>
        </section>

        {/* Section: Covered Reasons */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Valid Reasons for Refund</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>We consider the following reasons, subject to our General Conditions of Refund:</p>
          <ul style={{ fontSize: "1rem", color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 1.8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <li>Illness / Injury (including Covid)</li>
            <li>Pre-existing Medical Condition</li>
            <li>Pregnancy Complication</li>
            <li>Death of an Immediate Family Member</li>
            <li>Public Transport Failure</li>
            <li>Flight Disruption</li>
            <li>Transport Breakdown</li>
            <li>Severe Weather</li>
            <li>Home Emergency</li>
            <li>Theft of Documents</li>
            <li>Workplace Redundancy</li>
            <li>Jury Service</li>
            <li>Court Summons</li>
            <li>Armed Forces & Emergency Services Recall</li>
            <li>Relocated for Work</li>
            <li>Changes to Examination Dates</li>
          </ul>
          <p style={{ color: "var(--text-secondary)", marginTop: "1.5rem", lineHeight: 1.8 }}>
            If the <strong>Booked Event</strong> is cancelled or postponed by the provider, you should contact our Customer Service team directly. We may in addition to the above, consider other Emergency Circumstances at our discretion.
          </p>
        </section>

        {/* Section: General Conditions */}
        <section style={{ marginBottom: "3rem", background: "rgba(212, 175, 55, 0.03)", padding: "2rem", borderRadius: "4px", border: "1px solid rgba(212, 175, 55, 0.1)" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>General Conditions of Refund</h2>
          <ul style={{ fontSize: "1rem", color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
            <li>Any reason for a refund must not have been foreseeable when you made the <strong>Booking</strong>.</li>
            <li>We do not refund you if you made your <strong>Booking</strong> in error, or if it is no longer wanted or needed.</li>
            <li>If the <strong>Booked Event</strong> is cancelled, postponed and/or cannot be fulfilled by the Provider, please contact our Customer Service team directly.</li>
            <li>You must make all necessary arrangements to attend the <strong>Booked Event</strong>, including arranging any necessary travel or documents.</li>
            <li>We don’t refund you where you are worried about a Covid infection or where your travel plans are affected by Covid restrictions.</li>
            <li>We may ask for any reasonable additional evidence required to support your application.</li>
            <li>You will be asked to provide supporting evidence at your own expense, and a copy of the <strong>Booking Confirmation</strong>.</li>
            <li>Maximum refund value per transaction is <strong>$15,000</strong> (or local currency equivalent).</li>
          </ul>
        </section>

        {/* Section: Details per Reason */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Specific Reason Details</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Illness / Injury</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Illness or accidental injury to a person in the booking or someone in your immediate household. Requires a doctor's note confirming the inability to travel.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Pre-existing Medical Condition</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>A condition you already had that unexpectedly changed and prevents you from attending.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Pregnancy Complication</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>A complication you were unaware of when booking. Normal pregnancy is not covered.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Death</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Death of a person in the group or an immediate family member within 35 days of the flight. Death certificate required.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Public Transport Failure / Flight Disruption</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Unexpected disruption of public transport or cancellation/delay of connecting flights.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Severe Weather</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Weather where a Government Agency has issued warnings not to travel.</p>
            </div>
          </div>
        </section>

        {/* Section: Definitions */}
        <section style={{ marginBottom: "3rem", background: "rgba(255,255,255,0.02)", padding: "2rem", borderRadius: "4px" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Definitions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <p><strong>“We/Us/Our/Ours”:</strong> means the Party responsible for the refund (the Booking agent or authorised third party).</p>
            <p><strong>“You/Your/Yourself”:</strong> means the person who has made a Booking alone or as part of a group.</p>
            <p><strong>“Booking” or “Booked Event”:</strong> means the flight(s) transacted with us.</p>
            <p><strong>“Immediate Family Member”:</strong> means husband, wife, partner, parent, child, sibling, grandparent, or stepfamily.</p>
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
          <Link href="/" style={{ display: "inline-block", color: "var(--accent-gold)", textDecoration: "underline", fontSize: "0.9rem" }}>
            Return to Booking
          </Link>
        </div>
      </div>
    </main>
  );
}

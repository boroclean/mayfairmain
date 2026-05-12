"use client";

import Link from "next/link";

export default function PetPolicyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", background: "var(--bg-secondary)", padding: "4rem", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>PET POLICY</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mayfair & Main Private Charters</p>
        </div>

        {/* Section: General Rules */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>General Rules & Conditions</h2>
          <ul style={{ fontSize: "1rem", color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
            <li><strong>Maximum Weight:</strong> The maximum weight for pets in the cabin is 8 kg.</li>
            <li><strong>Safety & Comfort:</strong> Dogs must wear a muzzle and must sit on a blanket during the flight. The blanket must be provided by the owner of the animal.</li>
            <li><strong>Leash Requirement:</strong> Pets must be on a leash, and the leash must be fixed during the flight.</li>
            <li><strong>Liability:</strong> Any damage to the airplane caused by the animal must be covered by the passenger.</li>
            <li><strong>Commander's Authority:</strong> The Commander has the right to deny the flight in case of unruly or aggressive animals.</li>
          </ul>
        </section>

        {/* Section: UK Borders */}
        <section style={{ marginBottom: "3rem", background: "rgba(212, 175, 55, 0.03)", padding: "2rem", borderRadius: "4px", border: "1px solid rgba(212, 175, 55, 0.1)" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Before Entering UK Borders</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Strict regulations apply for pets entering the United Kingdom. Please ensure compliance with the following:</p>
          <ol style={{ fontSize: "1rem", color: "var(--text-secondary)", paddingLeft: "1.5rem", lineHeight: 1.8 }}>
            <li><strong>Microchip:</strong> Have your pet microchipped.</li>
            <li><strong>Rabies Vaccination:</strong> Have your pet vaccinated against rabies.</li>
            <li><strong>Treatment:</strong> All pet dogs must be treated for tick and Echinococcus (tapeworm). The treatment must be administered by a vet not less than 24 hours and not more than 48 hours prior to departure.</li>
            <li><strong>Blood Test:</strong> A blood test must be taken after the rabies vaccination, and then 6 months must pass before the pet can enter the UK without going into quarantine.</li>
          </ol>
        </section>

        {/* Section: Approved Airports */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Approved UK Airports & Fees</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Minimum 24 hours notice is needed for pet clearance at these approved airports:</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem 2rem", fontSize: "1rem", color: "var(--text-secondary)" }}>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGSC / Cambridge</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>FREE OF CHARGE</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGLF / Farnborough</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 300 / aircraft</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGMD / Lydd</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 350 (up to 4 pets)</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGNM / Leeds</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 200 (1st pet), EUR 100 others</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGBJ / Gloucestershire</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 200 (1st pet), EUR 100 others</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGTK / Oxford</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 350 (1st pet), EUR 150 others</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGKB / London Biggin Hill</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 350 (1st pet), EUR 150 others</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGSS / Stansted</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 450 (1st pet), EUR 150 others</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGPH / Edinburgh</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 470 (Mon-Fri) / EUR 720 (WE/OOH)</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGCC / Manchester</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 450 (1st pet) / EUR 700 (BH)</div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0" }}>EGKK / Gatwick</div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.5rem 0", color: "var(--accent-gold)" }}>EUR 650 / pet</div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            For questions or special arrangements, please contact your concierge.
          </p>
          <Link href="/" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--accent-gold)", textDecoration: "underline", fontSize: "0.9rem" }}>
            Return to Booking
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="section" role="alert" style={{ minHeight: "60vh", display: "grid", placeContent: "center", textAlign: "center" }}>
      <h1>Portfolio data is temporarily unavailable</h1>
      <p>We couldn’t load the latest portfolio content. Please try again.</p>
      <button className="admin-btn admin-btn-primary" onClick={reset} style={{ justifySelf: "center", marginTop: 16 }}>
        Try again
      </button>
    </main>
  );
}

"use client";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="section"
      role="alert"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          textAlign: "center",
          background: "var(--surface, rgba(255, 255, 255, 0.03))",
          border: "1px solid var(--line, rgba(255, 255, 255, 0.1))",
          borderRadius: "16px",
          padding: "40px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "12px",
            color: "var(--ink, #ffffff)",
          }}
        >
          Temporarily unavailable
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted, #a1a1aa)",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          We couldn’t load this section right now. Please try reloading.
        </p>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => reset()}
          style={{ justifySelf: "center" }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}

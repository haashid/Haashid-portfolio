"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 32, fontFamily: "system-ui, sans-serif" }}>
        <main role="alert">
          <h1>Content is temporarily unavailable</h1>
          <p>We couldn’t load the latest content. Please try again.</p>
          <button onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}

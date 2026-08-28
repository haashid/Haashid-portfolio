import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for is not part of this portfolio.</p>
      <Link className="button primary" href="/">
        Return home
      </Link>
    </main>
  );
}

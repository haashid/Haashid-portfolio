"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import "../admin.css";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <Sparkles size={20} />
          </div>
          <span>Portfolio Admin</span>
        </div>

        <h1 className="admin-login-title">Welcome back</h1>
        <p className="admin-login-sub">Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="admin-field">
            <label htmlFor="admin-email">Email address</label>
            <div className="admin-input-wrap">
              <Mail size={15} className="admin-input-icon" />
              <input
                className="admin-input"
                id="admin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <Lock size={15} className="admin-input-icon" />
              <input
                className="admin-input"
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="admin-input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="admin-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          This is a private admin area.
          <br />
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#000', color: '#fff' }}><Loader2 className="admin-spin" /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

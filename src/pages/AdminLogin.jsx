
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, ArrowLeft } from "lucide-react";
import "./AdminLogin.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.token) {
        throw new Error(result.message || "Login failed. Check your credentials.");
      }

      // Keep the session token in this browser.
      localStorage.setItem("aurelle_admin_token", result.token);

      if (result.admin) {
        localStorage.setItem(
          "aurelle_admin_profile",
          JSON.stringify(result.admin)
        );
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Make sure your backend is running."
          : err.message || "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="aurelle-login-page">
      <div className="aurelle-login-glow" />

      <Link to="/" className="aurelle-login-back">
        <ArrowLeft size={17} />
        Back to restaurant
      </Link>

      <section className="aurelle-login-card">
        <Link to="/" className="aurelle-login-brand">
          <span className="aurelle-login-mark">A</span>
          <span>
            <strong>AURELLE</strong>
            <small>RESTAURANT MANAGEMENT</small>
          </span>
        </Link>

        <div className="aurelle-login-lock">
          <LockKeyhole size={23} />
        </div>

        <p className="aurelle-login-eyebrow">SECURE ADMINISTRATION</p>
        <h1>Welcome <em>back.</em></h1>
        <p className="aurelle-login-description">
          Sign in to manage reservations and your restaurant dashboard.
        </p>

        <form onSubmit={handleSubmit} className="aurelle-login-form">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="admin@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="aurelle-password-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="aurelle-login-error" role="alert">{error}</p>
          )}

          <button
            className="aurelle-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <p className="aurelle-login-security">
          <LockKeyhole size={13} />
          Protected administrator access
        </p>
      </section>

      <footer className="aurelle-login-footer">
        © {new Date().getFullYear()} AURELLE · CRAFTED FOR EXCEPTIONAL EXPERIENCES
      </footer>
    </main>
  );
}

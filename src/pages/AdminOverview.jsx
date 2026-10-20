
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminMenu.css";
import "./AdminOverview.css";
import { formatReservationDate } from "../utils/reservations";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function apiRequest(path, token) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401 || response.status === 403) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error(result.message || "Could not load restaurant data.");
  }

  return result;
}

function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getBookingName(item) {
  return item.name || item.guestName || "Guest";
}

function getBookingId(item) {
  return item.reference || item._id || item.id || "—";
}

function formatTime(time) {
  if (!time) return "—";

  const [hours, minutes] = String(time).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminOverview() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [serverStats, setServerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = getToday();

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("aurelle_admin_token");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [reservationResult, statsResult] = await Promise.all([
        apiRequest("/api/reservations", token),
        apiRequest("/api/dashboard/stats", token),
      ]);

      setReservations(
        Array.isArray(reservationResult.reservations)
          ? reservationResult.reservations
          : []
      );

      setServerStats(statsResult.stats || null);
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        localStorage.removeItem("aurelle_admin_token");
        localStorage.removeItem("aurelle_admin_profile");
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(err.message || "Unable to connect to the Aurelle API.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const todayBookings = reservations.filter(
      (item) => item.date === today && item.status !== "Cancelled"
    );

    const confirmed = reservations.filter(
      (item) => item.status === "Confirmed"
    );

    const pending = reservations.filter(
      (item) => item.status === "Pending"
    );

    const cancelled = reservations.filter(
      (item) => item.status === "Cancelled"
    );

    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      return {
        key,
        label: new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
        }).format(date),
        count: reservations.filter(
          (item) => item.date === key && item.status !== "Cancelled"
        ).length,
      };
    });

    return {
      total: serverStats?.total ?? reservations.length,
      today: serverStats?.today ?? todayBookings.length,
      guests: todayBookings.reduce(
        (sum, item) => sum + (Number(item.guests) || 0),
        0
      ),
      confirmed: serverStats?.confirmed ?? confirmed.length,
      pending: serverStats?.pending ?? pending.length,
      cancelled: cancelled.length,
      lastSevenDays,
    };
  }, [reservations, serverStats, today]);

  const maxDailyBookings = Math.max(
    1,
    ...metrics.lastSevenDays.map((day) => day.count)
  );

  const recentReservations = [...reservations]
    .sort((a, b) =>
      `${b.date || ""}T${b.time || "00:00"}`.localeCompare(
        `${a.date || ""}T${a.time || "00:00"}`
      )
    )
    .slice(0, 5);

  function logout() {
    localStorage.removeItem("aurelle_admin_token");
    localStorage.removeItem("aurelle_admin_profile");
    navigate("/admin/login", { replace: true });
  }

  return (
    <main className="aurelle-admin ao-page">
      <aside className="am-sidebar">
        <Link to="/" className="am-brand">
          <span className="am-brand-mark">A</span>
          <span className="am-brand-copy">
            <strong>AURELLE</strong>
            <small>RESTAURANT CONTROL</small>
          </span>
        </Link>

        <div className="am-sidebar-label">WORKSPACE</div>
        <nav className="am-nav" aria-label="Admin navigation">
          <Link to="/admin" className="am-nav-link active">
            <span className="am-nav-icon">◈</span>
            Overview
            <span className="am-nav-indicator" />
          </Link>
          <Link to="/admin/menu" className="am-nav-link">
            <span className="am-nav-icon">♧</span>
            Menu management
          </Link>
          <Link to="/admin/reservations" className="am-nav-link">
            <span className="am-nav-icon">▦</span>
            Reservations
          </Link>
        </nav>

        <div className="am-sidebar-bottom">
          <div className="am-sidebar-status">
            <span className="am-status-dot" />
            <div>
              <strong>{error ? "Connection issue" : "Database workspace"}</strong>
              <small>{error ? "Check API connection" : "MongoDB API"}</small>
            </div>
          </div>
          <Link to="/menu" className="am-public-link">
            <span>↗</span> View public menu
          </Link>
          <Link to="/" className="am-back-home">← Back to website</Link>
          <button
            type="button"
            onClick={logout}
            style={{
              marginTop: 14,
              padding: "10px 0",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <section className="am-main">
        <header className="am-topbar">
          <div className="am-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Overview</strong>
          </div>
          <div className="am-topbar-right">
            <span className="am-live-dot" />
            <span>LIVE DATABASE</span>
            <div className="am-avatar">A</div>
          </div>
        </header>

        <div className="am-content ao-content">
          <section className="am-page-heading ao-heading">
            <div>
              <span className="am-eyebrow">AURELLE / INTELLIGENCE</span>
              <h1>Good day, <em>admin.</em></h1>
              <p>Your restaurant at a glance. Every detail, thoughtfully managed.</p>
            </div>
            <button
              type="button"
              className="am-primary-btn"
              onClick={loadDashboard}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh dashboard ↻"}
            </button>
          </section>

          {error && (
            <div className="am-notice" role="alert">
              {error}
              <button
                type="button"
                onClick={loadDashboard}
                style={{ marginLeft: 12 }}
              >
                Retry
              </button>
            </div>
          )}

          {loading && (
            <p role="status" style={{ color: "inherit", padding: "12px 0" }}>
              Loading live reservations...
            </p>
          )}

          <section className="ao-welcome">
            <div>
              <span className="am-eyebrow">THE DAILY EDITION</span>
              <h2>Today at <em>AURELLE.</em></h2>
              <p>{formatReservationDate(today)} · Live database snapshot</p>
            </div>
            <div className="ao-welcome-mark" aria-hidden="true">A.</div>
          </section>

          <section className="am-stats ao-stats" aria-label="Restaurant statistics">
            <article className="am-stat-card">
              <span className="am-stat-icon">▦</span>
              <span className="am-stat-label">TODAY'S BOOKINGS</span>
              <strong>{String(metrics.today).padStart(2, "0")}</strong>
              <small>{metrics.guests} guests expected today</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon am-stat-green">✓</span>
              <span className="am-stat-label">CONFIRMED</span>
              <strong>{String(metrics.confirmed).padStart(2, "0")}</strong>
              <small>Confirmed reservations</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon">◷</span>
              <span className="am-stat-label">AWAITING ACTION</span>
              <strong>{String(metrics.pending).padStart(2, "0")}</strong>
              <small>Pending confirmation</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon">▤</span>
              <span className="am-stat-label">ALL RESERVATIONS</span>
              <strong>{String(metrics.total).padStart(2, "0")}</strong>
              <small>Stored in MongoDB</small>
            </article>
          </section>

          <section className="ao-middle-grid">
            <article className="ao-panel ao-chart-panel">
              <div className="ao-panel-head">
                <div>
                  <span className="am-eyebrow">BOOKING ACTIVITY</span>
                  <h2>Last seven days.</h2>
                </div>
                <span className="ao-panel-icon">↗</span>
              </div>

              <div className="ao-chart" role="img" aria-label="Reservation count by day over the last seven days">
                {metrics.lastSevenDays.map((day) => (
                  <div className="ao-chart-column" key={day.key}>
                    <span className="ao-chart-value">{day.count}</span>
                    <div className="ao-bar-track">
                      <div
                        className="ao-bar"
                        style={{
                          height: `${Math.max(6, (day.count / maxDailyBookings) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="ao-chart-label">{day.label}</span>
                  </div>
                ))}
              </div>
              <p className="ao-chart-caption">
                Based on database reservations, excluding cancelled bookings.
              </p>
            </article>

            <article className="ao-panel ao-status-panel">
              <div className="ao-panel-head">
                <div>
                  <span className="am-eyebrow">BOOKING HEALTH</span>
                  <h2>Reservation status.</h2>
                </div>
              </div>

              {[
                ["Confirmed", metrics.confirmed, "ao-status-gold"],
                ["Pending", metrics.pending, "ao-status-pending"],
                ["Cancelled", metrics.cancelled, "ao-status-red"],
              ].map(([label, count, className]) => (
                <div className="ao-status-row" key={label}>
                  <span className={`ao-status-dot ${className}`} />
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}

              <div className="ao-status-total">
                <span>Total reservations</span>
                <strong>{metrics.total}</strong>
              </div>
            </article>
          </section>

          <section className="ao-panel ao-recent-panel">
            <div className="ao-panel-head ao-recent-heading">
              <div>
                <span className="am-eyebrow">THE GUEST BOOK</span>
                <h2>Recent reservations.</h2>
              </div>
              <Link to="/admin/reservations" className="ao-text-link">
                View all reservations <span>↗</span>
              </Link>
            </div>

            {recentReservations.length ? (
              <div className="ao-table-wrap">
                <table className="ao-table">
                  <thead>
                    <tr>
                      <th>GUEST</th>
                      <th>DATE & TIME</th>
                      <th>PARTY</th>
                      <th>STATUS</th>
                      <th>REFERENCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((item) => (
                      <tr key={item._id || item.reference}>
                        <td>
                          <div className="ao-guest-cell">
                            <span className="ao-guest-avatar">
                              {getBookingName(item).charAt(0).toUpperCase()}
                            </span>
                            <span>
                              <strong>{getBookingName(item)}</strong>
                              <small>{item.email || "No email supplied"}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <strong>{formatReservationDate(item.date)}</strong>
                          <small className="ao-cell-sub">{formatTime(item.time)}</small>
                        </td>
                        <td>{item.guests || 1} guests</td>
                        <td>
                          <span className={`ao-pill ao-pill-${(item.status || "Pending").toLowerCase()}`}>
                            {item.status || "Pending"}
                          </span>
                        </td>
                        <td className="ao-value-cell">{getBookingId(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ao-empty">
                <span>◇</span>
                <p>{loading ? "Loading reservations..." : "No database reservations found."}</p>
                <Link to="/admin/reservations">Open reservation management ↗</Link>
              </div>
            )}
          </section>

          <section className="ao-quick-actions">
            <Link to="/admin/reservations" className="ao-action-card">
              <span>▦</span>
              <div>
                <strong>Manage reservations</strong>
                <small>Confirm, cancel and review bookings</small>
              </div>
              <b>↗</b>
            </Link>
            <Link to="/admin/menu" className="ao-action-card">
              <span>♧</span>
              <div>
                <strong>Manage your menu</strong>
                <small>Update dishes, pricing and availability</small>
              </div>
              <b>↗</b>
            </Link>
          </section>

          <footer className="am-footer">
            <span>© AURELLE — RESTAURANT CONTROL</span>
            <span>CRAFTED WITH INTENTION <b>✳</b></span>
          </footer>
        </div>
      </section>
    </main>
  );
}

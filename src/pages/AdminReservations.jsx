import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminMenu.css";
import "./AdminReservations.css";
import { formatReservationDate } from "../utils/reservations";

const STORAGE_KEY = "aurelle_demo_reservations";
const statuses = ["All", "Pending", "Confirmed", "Cancelled"];

function readReservations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getId(item) {
  return item.id || item.reference || item._id;
}

function getName(item) {
  return item.name || item.guestName || "Guest";
}

function getReference(item) {
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

export default function AdminReservations() {
  const [reservations, setReservations] = useState(readReservations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [workingId, setWorkingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function refreshReservations() {
    setReservations(readReservations());
    setError("");
    setNotice("Reservation list refreshed.");
  }

  useEffect(() => {
    function syncReservations(event) {
      // The storage event syncs changes made in another browser tab.
      if (!event || event.key === STORAGE_KEY || event.key === null) {
        setReservations(readReservations());
      }
    }

    window.addEventListener("storage", syncReservations);

    return () => {
      window.removeEventListener("storage", syncReservations);
    };
  }, []);

  const filteredReservations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...reservations]
      .filter((item) => {
        const searchable = [
          getName(item),
          item.email,
          item.phone,
          item.reference,
          item.id,
          item._id,
          item.date,
        ];

        const matchesSearch =
          !query ||
          searchable.some((value) =>
            String(value || "").toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        const matchesDate = !dateFilter || item.date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) =>
        `${a.date || ""}T${a.time || "00:00"}`.localeCompare(
          `${b.date || ""}T${b.time || "00:00"}`
        )
      );
  }, [reservations, search, statusFilter, dateFilter]);

  const counts = useMemo(
    () => ({
      total: reservations.length,
      pending: reservations.filter((item) => item.status === "Pending").length,
      confirmed: reservations.filter((item) => item.status === "Confirmed").length,
      cancelled: reservations.filter((item) => item.status === "Cancelled").length,
    }),
    [reservations]
  );

  function saveReservations(nextReservations) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReservations));
      setReservations(nextReservations);
      return true;
    } catch {
      setError("Could not save changes in this browser.");
      return false;
    }
  }

  function changeStatus(item, status) {
    if (workingId) return;

    if (
      status === "Cancelled" &&
      !window.confirm(`Cancel the reservation for ${getName(item)}?`)
    ) {
      return;
    }

    if (
      status === "Pending" &&
      !window.confirm(`Reopen ${getName(item)}'s reservation?`)
    ) {
      return;
    }

    const id = getId(item);
    setWorkingId(id);
    setError("");
    setNotice("");

    try {
      const current = readReservations();
      const next = current.map((reservation) =>
        getId(reservation) === id
          ? { ...reservation, status, updatedAt: new Date().toISOString() }
          : reservation
      );

      if (saveReservations(next)) {
        setNotice(
          `${getName(item)}'s reservation is now ${status.toLowerCase()}.`
        );
      }
    } finally {
      setWorkingId(null);
    }
  }

  function deleteReservation(item) {
    if (workingId) return;

    if (
      !window.confirm(
        `Delete the reservation for ${getName(item)} from this browser?`
      )
    ) {
      return;
    }

    const id = getId(item);
    setError("");
    setNotice("");

    const next = readReservations().filter(
      (reservation) => getId(reservation) !== id
    );

    if (saveReservations(next)) {
      setNotice("Reservation deleted from this browser.");
    }
  }

  function logout() {
    // Demo-only sign out: no server session exists in this version.
    window.location.href = "/";
  }

  return (
    <main className="aurelle-admin ar-page">
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
          <Link to="/admin" className="am-nav-link">
            <span className="am-nav-icon">◈</span>
            Overview
          </Link>

          <Link to="/admin/menu" className="am-nav-link">
            <span className="am-nav-icon">♧</span>
            Menu management
          </Link>

          <Link to="/admin/reservations" className="am-nav-link active">
            <span className="am-nav-icon">▦</span>
            Reservations
            <span className="am-nav-indicator" />
          </Link>
        </nav>

        <div className="am-sidebar-bottom">
          <div className="am-sidebar-status">
            <span className="am-status-dot" />
            <div>
              <strong>Browser storage</strong>
              <small>Frontend demo mode</small>
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
            Exit dashboard
          </button>
        </div>
      </aside>

      <section className="am-main">
        <header className="am-topbar">
          <div className="am-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Reservation management</strong>
          </div>

          <div className="am-topbar-right">
            <span className="am-live-dot" />
            <span>DEMO MODE</span>
            <div className="am-avatar">A</div>
          </div>
        </header>

        <div className="am-content ar-content">
          <section className="am-page-heading">
            <div>
              <span className="am-eyebrow">AURELLE / GUEST EXPERIENCE</span>
              <h1>Reservation <em>management.</em></h1>
              <p>Every guest matters. Every table, thoughtfully arranged.</p>
            </div>

            <button
              type="button"
              className="am-primary-btn"
              onClick={refreshReservations}
            >
              Refresh reservations ↻
            </button>
          </section>

          {notice && (
            <div className="am-notice" role="status">
              <span>✓</span> {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="am-notice" role="alert">
              {error}
              <button
                type="button"
                onClick={() => setError("")}
                style={{ marginLeft: 12 }}
              >
                Dismiss
              </button>
            </div>
          )}

          <section className="ar-stats" aria-label="Reservation summary">
            <article className="am-stat-card">
              <span className="am-stat-icon">▦</span>
              <span className="am-stat-label">ALL RESERVATIONS</span>
              <strong>{String(counts.total).padStart(2, "0")}</strong>
              <small>Saved in this browser</small>
            </article>

            <article className="am-stat-card">
              <span className="am-stat-icon am-stat-green">✓</span>
              <span className="am-stat-label">CONFIRMED</span>
              <strong>{String(counts.confirmed).padStart(2, "0")}</strong>
              <small>Ready for the guest</small>
            </article>

            <article className="am-stat-card">
              <span className="am-stat-icon">◷</span>
              <span className="am-stat-label">PENDING</span>
              <strong>{String(counts.pending).padStart(2, "0")}</strong>
              <small>Awaiting a decision</small>
            </article>

            <article className="am-stat-card">
              <span className="am-stat-icon">×</span>
              <span className="am-stat-label">CANCELLED</span>
              <strong>{String(counts.cancelled).padStart(2, "0")}</strong>
              <small>Cancelled bookings</small>
            </article>
          </section>

          <section className="ar-panel">
            <div className="ar-panel-head">
              <div>
                <span className="am-eyebrow">THE RESERVATION BOOK</span>
                <h2>Guest bookings <span>({filteredReservations.length})</span></h2>
              </div>
              <span className="ar-panel-note">LOCAL DEMO DATA</span>
            </div>

            <div className="ar-toolbar">
              <label className="ar-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search guest, email, phone or booking ID..."
                  aria-label="Search reservations"
                />
              </label>

              <label className="ar-filter">
                <span className="ar-sr-only">Filter status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="ar-filter ar-date-filter">
                <span className="ar-sr-only">Filter date</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  aria-label="Filter by date"
                />
              </label>

              {(search || dateFilter || statusFilter !== "All") && (
                <button
                  type="button"
                  className="ar-clear"
                  onClick={() => {
                    setSearch("");
                    setDateFilter("");
                    setStatusFilter("All");
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            <div className="ar-status-tabs" aria-label="Quick status filters">
              {statuses.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={statusFilter === status ? "active" : ""}
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={statusFilter === status}
                >
                  {status}
                  <span>
                    {status === "All"
                      ? counts.total
                      : reservations.filter((item) => item.status === status).length}
                  </span>
                </button>
              ))}
            </div>

            {filteredReservations.length ? (
              <div className="ar-table-wrap">
                <table className="ar-table">
                  <thead>
                    <tr>
                      <th>GUEST</th>
                      <th>DATE & TIME</th>
                      <th>PARTY</th>
                      <th>REFERENCE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReservations.map((item) => {
                      const id = getId(item);
                      const status = item.status || "Pending";

                      return (
                        <tr key={id}>
                          <td>
                            <div className="ar-guest">
                              <span className="ar-guest-avatar">
                                {getName(item).charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <strong>{getName(item)}</strong>
                                <small>{item.email || "No email supplied"}</small>
                                <small>{item.phone || "No phone supplied"}</small>
                                <small className="ar-id">{getReference(item)}</small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong>{formatReservationDate(item.date)}</strong>
                            <small className="ar-sub">{formatTime(item.time)}</small>
                          </td>

                          <td>{item.guests || 1} guests</td>
                          <td className="ar-id">{getReference(item)}</td>

                          <td>
                            <span className={`ar-status ar-${status.toLowerCase()}`}>
                              <span />
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="ar-actions">
                              {status === "Pending" && (
                                <button
                                  type="button"
                                  className="ar-action-confirm"
                                  disabled={workingId !== null}
                                  onClick={() => changeStatus(item, "Confirmed")}
                                  title="Confirm reservation"
                                  aria-label={`Confirm ${getName(item)}`}
                                >
                                  {workingId === id ? "…" : "✓"}
                                </button>
                              )}

                              {status === "Confirmed" && (
                                <button
                                  type="button"
                                  disabled={workingId !== null}
                                  onClick={() => changeStatus(item, "Pending")}
                                  title="Reopen reservation"
                                  aria-label={`Reopen ${getName(item)}`}
                                >
                                  ↺
                                </button>
                              )}

                              {status !== "Cancelled" && (
                                <button
                                  type="button"
                                  className="ar-action-cancel"
                                  disabled={workingId !== null}
                                  onClick={() => changeStatus(item, "Cancelled")}
                                  title="Cancel reservation"
                                  aria-label={`Cancel ${getName(item)}`}
                                >
                                  ×
                                </button>
                              )}

                              {status === "Cancelled" && (
                                <button
                                  type="button"
                                  disabled={workingId !== null}
                                  onClick={() => changeStatus(item, "Pending")}
                                  title="Reopen reservation"
                                  aria-label={`Reopen ${getName(item)}`}
                                >
                                  ↺
                                </button>
                              )}

                              <button
                                type="button"
                                className="ar-action-delete"
                                disabled={workingId !== null}
                                onClick={() => deleteReservation(item)}
                                title="Delete permanently"
                                aria-label={`Delete ${getName(item)}`}
                              >
                                ⌫
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ar-empty">
                <span>◇</span>
                <h3>No reservations found</h3>
                <p>
                  New bookings saved from this browser will appear here.
                </p>
              </div>
            )}
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

import { useCallback, useEffect, useMemo, useState } from "react";
import "./Admin.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STORAGE_KEY = "aurelle_admin_demo_bookings";

const initialBookings = [
  {
    id: "AUR-1001",
    name: "Sophia Bennett",
    email: "sophia@example.com",
    date: "2026-10-18",
    time: "19:00",
    guests: 2,
    status: "Confirmed",
    createdAt: "2026-10-16T09:30:00",
  },
  {
    id: "AUR-1002",
    name: "Oliver James",
    email: "oliver@example.com",
    date: "2026-10-18",
    time: "20:00",
    guests: 4,
    status: "Pending",
    createdAt: "2026-10-16T10:15:00",
  },
  {
    id: "AUR-1003",
    name: "Amelia Rose",
    email: "amelia@example.com",
    date: "2026-10-19",
    time: "18:30",
    guests: 3,
    status: "Pending",
    createdAt: "2026-10-16T11:20:00",
  },
  {
    id: "AUR-1004",
    name: "William Carter",
    email: "william@example.com",
    date: "2026-10-19",
    time: "19:30",
    guests: 6,
    status: "Cancelled",
    createdAt: "2026-10-16T12:05:00",
  },
  {
    id: "AUR-1005",
    name: "Isabella Grace",
    email: "isabella@example.com",
    date: "2026-10-20",
    time: "20:30",
    guests: 2,
    status: "Confirmed",
    createdAt: "2026-10-16T13:40:00",
  },
  {
    id: "AUR-1006",
    name: "Noah Anderson",
    email: "noah@example.com",
    date: "2026-10-21",
    time: "18:00",
    guests: 5,
    status: "Pending",
    createdAt: "2026-10-16T14:10:00",
  },
];

const normalizeStatus = (status) => {
  const value = String(status || "Pending").toLowerCase();

  if (value === "confirmed") return "Confirmed";
  if (value === "cancelled" || value === "canceled") {
    return "Cancelled";
  }

  return "Pending";
};

const normalizeBooking = (booking, index = 0) => ({
  ...booking,
  id: booking.id ?? `AUR-${1001 + index}`,
  name: booking.name ?? booking.customerName ?? "Guest",
  email: booking.email ?? "",
  date: String(booking.date ?? "").slice(0, 10),
  time: String(booking.time ?? "").slice(0, 5),
  guests: Number(booking.guests ?? booking.partySize ?? 1),
  status: normalizeStatus(booking.status),
});

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

function Icon({ children }) {
  return <span className="aur-icon" aria-hidden="true">{children}</span>;
}

function StatusBadge({ status }) {
  return (
    <span className={`aur-status aur-status--${status.toLowerCase()}`}>
      <span className="aur-status-dot" />
      {status}
    </span>
  );
}

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`);

      if (!response.ok) {
        throw new Error("Could not load bookings from server.");
      }

      const result = await response.json();
      const rows = Array.isArray(result)
        ? result
        : result.bookings ?? result.data ?? [];

      const normalized = rows.map(normalizeBooking);

      setBookings(normalized);
      setDemoMode(false);
    } catch {
      let saved = [];

      try {
        saved = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "null"
        );
      } catch {
        saved = null;
      }

      const demoRows = Array.isArray(saved)
        ? saved
        : initialBookings;

      setBookings(demoRows.map(normalizeBooking));
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return {
      total: bookings.length,
      pending: bookings.filter(
        (item) => item.status === "Pending"
      ).length,
      confirmed: bookings.filter(
        (item) => item.status === "Confirmed"
      ).length,
      today: bookings.filter(
        (item) => item.date === today &&
          item.status !== "Cancelled"
      ).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings
      .filter((booking) => {
        const matchesSearch = [
          booking.id,
          booking.name,
          booking.email,
          booking.date,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(term)
        );

        const matchesStatus =
          statusFilter === "All" ||
          booking.status === statusFilter;

        const matchesDate =
          !dateFilter || booking.date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(
          `${b.date} ${b.time}`
        )
      );
  }, [bookings, search, statusFilter, dateFilter]);

  async function updateStatus(booking, nextStatus) {
    if (booking.status === nextStatus || updatingId) return;

    if (
      nextStatus === "Cancelled" &&
      !window.confirm(
        `Cancel the reservation for ${booking.name}?`
      )
    ) {
      return;
    }

    setUpdatingId(booking.id);
    setNotice("");

    const previousBookings = bookings;

    const updatedBookings = bookings.map((item) =>
      item.id === booking.id
        ? { ...item, status: nextStatus }
        : item
    );

    // Update the interface immediately.
    setBookings(updatedBookings);

    try {
      if (demoMode) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedBookings)
        );

        setNotice(
          `Demo reservation marked ${nextStatus.toLowerCase()}.`
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${encodeURIComponent(booking.id)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("The server could not update this booking.");
      }

      setNotice(
        `Reservation ${nextStatus.toLowerCase()} successfully.`
      );

      // Refresh from the real database.
      await loadBookings();
    } catch (error) {
      setBookings(previousBookings);

      setNotice(
        error.message || "Could not update the reservation."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="aur-admin">
      <aside className={`aur-sidebar ${mobileMenu ? "aur-sidebar--open" : ""}`}>
        <a className="aur-brand" href="/" aria-label="Aurelle home">
          <span className="aur-brand-mark">A</span>
          <span>
            <strong>AURELLE</strong>
            <small>RESTAURANT ADMIN</small>
          </span>
        </a>

        <div className="aur-side-label">WORKSPACE</div>

        <nav className="aur-side-nav">
          <a className="aur-nav-link aur-nav-link--active" href="#overview"
            onClick={() => setMobileMenu(false)}>
            <Icon>▦</Icon>
            Overview
          </a>

          <a className="aur-nav-link" href="#reservations"
            onClick={() => setMobileMenu(false)}>
            <Icon>▤</Icon>
            Reservations
            <span className="aur-nav-count">{stats.pending}</span>
          </a>

          <a className="aur-nav-link" href="#reservations"
            onClick={() => {
              setStatusFilter("Confirmed");
              setMobileMenu(false);
            }}>
            <Icon>✓</Icon>
            Confirmed bookings
          </a>
        </nav>

        <div className="aur-side-label">QUICK FILTERS</div>

        <div className="aur-quick-filters">
          <button onClick={() => {
            setStatusFilter("Pending");
            setDateFilter("");
            setMobileMenu(false);
          }}>
            <span className="aur-filter-dot aur-filter-dot--pending" />
            Pending
          </button>

          <button onClick={() => {
            setStatusFilter("Confirmed");
            setDateFilter("");
            setMobileMenu(false);
          }}>
            <span className="aur-filter-dot aur-filter-dot--confirmed" />
            Confirmed
          </button>

          <button onClick={() => {
            setStatusFilter("Cancelled");
            setDateFilter("");
            setMobileMenu(false);
          }}>
            <span className="aur-filter-dot aur-filter-dot--cancelled" />
            Cancelled
          </button>
        </div>

        <div className="aur-sidebar-bottom">
          <div className="aur-open-indicator">
            <span />
            Management system
            <small>READY</small>
          </div>

          <a href="/" className="aur-back-link">
            <Icon>↗</Icon>
            View restaurant website
          </a>

          <div className="aur-admin-profile">
            <div className="aur-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Restaurant management</small>
            </div>
            <span className="aur-profile-dots">•••</span>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="aur-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="aur-main">
        <header className="aur-topbar">
          <button
            className="aur-mobile-menu"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <div className="aur-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Overview</strong>
          </div>

          <div className="aur-topbar-right">
            <div className="aur-live-pill">
              <span />
              {demoMode ? "DEMO MODE" : "ADMIN PANEL"}
            </div>
            <div className="aur-top-avatar">A</div>
          </div>
        </header>

        <div className="aur-content">
          <section className="aur-page-heading" id="overview">
            <div>
              <div className="aur-eyebrow">
                <span /> RESTAURANT MANAGEMENT
              </div>
              <h1>Good day, <em>Administrator.</em></h1>
              <p>
                Here’s what’s happening at Aurelle today.
              </p>
            </div>

            <div className="aur-heading-date">
              <span>◷</span>
              {todayLabel}
            </div>
          </section>

          {demoMode && (
            <div className="aur-demo-notice">
              <span>ⓘ</span>
              <div>
                <strong>Preview mode</strong>
                <p>
                  The booking API is unavailable. Sample bookings are
                  being used, and changes are saved in this browser only.
                  Connect your backend for database persistence.
                </p>
              </div>
              <button onClick={loadBookings}>Retry connection</button>
            </div>
          )}

          <section className="aur-stats-grid" aria-label="Booking statistics">
            <article className="aur-stat-card">
              <div className="aur-stat-top">
                <span>Total reservations</span>
                <span className="aur-stat-icon">▤</span>
              </div>
              <div className="aur-stat-value">{stats.total}</div>
              <div className="aur-stat-foot">
                <span className="aur-stat-neutral">ALL BOOKINGS</span>
                <span>Across all dates</span>
              </div>
            </article>

            <article className="aur-stat-card">
              <div className="aur-stat-top">
                <span>Awaiting confirmation</span>
                <span className="aur-stat-icon aur-stat-icon--pending">◷</span>
              </div>
              <div className="aur-stat-value">{stats.pending}</div>
              <div className="aur-stat-foot">
                <span className="aur-stat-pending">NEEDS ATTENTION</span>
                <span>Pending bookings</span>
              </div>
            </article>

            <article className="aur-stat-card">
              <div className="aur-stat-top">
                <span>Confirmed</span>
                <span className="aur-stat-icon aur-stat-icon--confirmed">✓</span>
              </div>
              <div className="aur-stat-value">{stats.confirmed}</div>
              <div className="aur-stat-foot">
                <span className="aur-stat-success">CONFIRMED</span>
                <span>Ready for service</span>
              </div>
            </article>

            <article className="aur-stat-card">
              <div className="aur-stat-top">
                <span>Today’s reservations</span>
                <span className="aur-stat-icon">⌂</span>
              </div>
              <div className="aur-stat-value">{stats.today}</div>
              <div className="aur-stat-foot">
                <span className="aur-stat-neutral">TODAY</span>
                <span>Not cancelled</span>
              </div>
            </article>
          </section>

          <section className="aur-bookings-panel" id="reservations">
            <div className="aur-panel-heading">
              <div>
                <div className="aur-panel-kicker">RESERVATION MANAGEMENT</div>
                <h2>Guest reservations</h2>
                <p>Review and manage every dining experience.</p>
              </div>

              <button className="aur-refresh-button" onClick={loadBookings}
                disabled={loading}>
                <span>↻</span> Refresh
              </button>
            </div>

            {notice && (
              <div className="aur-action-notice" role="status">
                <span>✓</span>
                {notice}
                <button onClick={() => setNotice("")} aria-label="Dismiss">
                  ×
                </button>
              </div>
            )}

            <div className="aur-toolbar">
              <label className="aur-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search guest, email or booking ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <kbd>SEARCH</kbd>
              </label>

              <div className="aur-filter-controls">
                <label className="aur-select-wrap">
                  <span className="aur-control-label">STATUS</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>

                <label className="aur-select-wrap aur-date-control">
                  <span className="aur-control-label">DATE</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(event) => setDateFilter(event.target.value)}
                  />
                </label>

                <button className="aur-clear-button" onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDateFilter("");
                }}>
                  Reset
                </button>
              </div>
            </div>

            <div className="aur-table-meta">
              <span>
                Showing <strong>{filteredBookings.length}</strong> of{" "}
                <strong>{bookings.length}</strong> reservations
              </span>
              <span className="aur-secure-label">AURELLE · PRIVATE DINING</span>
            </div>

            <div className="aur-table-scroll">
              <table className="aur-bookings-table">
                <thead>
                  <tr>
                    <th>GUEST</th>
                    <th>BOOKING ID</th>
                    <th>DATE & TIME</th>
                    <th>GUESTS</th>
                    <th>STATUS</th>
                    <th className="aur-actions-heading">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="aur-empty-state">
                        <span className="aur-spinner" />
                        Loading reservations...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="aur-empty-state">
                        <span className="aur-empty-icon">⌕</span>
                        <strong>No reservations found</strong>
                        <span>Try changing your search or filters.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="aur-guest-cell">
                            <div className="aur-guest-avatar">
                              {booking.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="aur-guest-info">
                              <strong>{booking.name}</strong>
                              <span>{booking.email || "No email provided"}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="aur-booking-id">
                            {booking.id}
                          </span>
                        </td>

                        <td>
                          <div className="aur-date-cell">
                            <strong>{formatDate(booking.date)}</strong>
                            <span>{formatTime(booking.time)}</span>
                          </div>
                        </td>

                        <td>
                          <span className="aur-guests">
                            <span>♧</span> {booking.guests}
                          </span>
                        </td>

                        <td>
                          <StatusBadge status={booking.status} />
                        </td>

                        <td>
                          <div className="aur-row-actions">
                            {booking.status === "Pending" && (
                              <button
                                className="aur-action-confirm"
                                disabled={updatingId !== null}
                                onClick={() => updateStatus(booking, "Confirmed")}
                              >
                                {updatingId === booking.id ? "Saving..." : "Confirm"}
                              </button>
                            )}

                            {booking.status !== "Cancelled" && (
                              <button
                                className="aur-action-cancel"
                                disabled={updatingId !== null}
                                onClick={() => updateStatus(booking, "Cancelled")}
                                aria-label={`Cancel reservation for ${booking.name}`}
                                title="Cancel reservation"
                              >
                                Cancel
                              </button>
                            )}

                            {booking.status === "Cancelled" && (
                              <button
                                className="aur-action-restore"
                                disabled={updatingId !== null}
                                onClick={() => updateStatus(booking, "Pending")}
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="aur-table-footer">
              <span>Thoughtfully managed. Exclusively Aurelle.</span>
              <span>{filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}</span>
            </div>
          </section>

          <footer className="aur-admin-footer">
            <span>© {new Date().getFullYear()} AURELLE RESTAURANT</span>
            <span>CRAFTED FOR EXCEPTIONAL EXPERIENCES</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

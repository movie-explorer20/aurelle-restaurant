import { useEffect, useState } from "react";
import "./BookingModal.css";

const STORAGE_KEY = "aurelle_demo_reservations";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  occasion: "Dinner",
  requests: "",
};

const timeOptions = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "5:00 PM", "5:30 PM", "6:00 PM",
  "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
  "8:30 PM", "9:00 PM",
];

function getLocalDate() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function readReservations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function to24Hour(time) {
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return "";
  }

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export default function BookingModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  const minDate = getLocalDate();

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape" && !loading) onClose?.();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setBookingReference("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const date = form.date;
    const time = to24Hour(form.time);
    const guests = Number(form.guests);

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.length < 7 || phone.length > 25) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!date || date < minDate) {
      setError("Please select today or a future date.");
      return;
    }

    if (!time) {
      setError("Please select a valid reservation time.");
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      setError("Please select between 1 and 12 guests.");
      return;
    }

    setLoading(true);

    try {
      const existing = readReservations();

      // Prevent duplicate active bookings for the same email,
      // date, and time in this browser.
      const duplicate = existing.some(
        (item) =>
          String(item.email || "").toLowerCase() === email &&
          item.date === date &&
          item.time === time &&
          item.status !== "Cancelled"
      );

      if (duplicate) {
        setError(
          "You already have a reservation for this email, date and time."
        );
        setLoading(false);
        return;
      }

      const reference = `AUR-${Date.now().toString().slice(-8)}`;

      const reservation = {
        id: reference,
        reference,
        name,
        email,
        phone,
        date,
        time,
        guests,
        requests: [
          `Occasion: ${form.occasion}`,
          form.requests.trim(),
        ].filter(Boolean).join(" | "),
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([reservation, ...existing])
      );

      setBookingReference(reference);
      setSubmitted(true);
    } catch {
      setError(
        "Your browser could not save this booking. Please check browser storage settings and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) onClose?.();
  }

  function handleNewBooking() {
    setForm(initialForm);
    setSubmitted(false);
    setError("");
    setBookingReference("");
  }

  return (
    <div
      className="aurelle-booking-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        className="aurelle-booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aurelle-booking-title"
      >
        <button
          type="button"
          className="aurelle-booking-close"
          onClick={handleClose}
          aria-label="Close booking form"
          disabled={loading}
        >
          ×
        </button>

        <div className="aurelle-booking-heading">
          <span className="aurelle-booking-eyebrow">
            AN EXCEPTIONAL EVENING AWAITS
          </span>

          <h2 id="aurelle-booking-title">
            Reserve Your <em>Table</em>
          </h2>

          <p>
            Join us at AURELLE for thoughtful hospitality and
            memorable dining.
          </p>
        </div>

        {submitted ? (
          <div className="aurelle-booking-success" role="status">
            <span className="aurelle-booking-success-icon">✓</span>

            <h3>Thank you, {form.name}.</h3>

            <p>
              Your reservation request has been saved in this browser.
              Your table is not confirmed until the restaurant approves
              your request.
            </p>

            <div className="aurelle-booking-summary">
              <span>Reference: {bookingReference}</span>
              <span>Date: {form.date}</span>
              <span>Time: {form.time}</span>
              <span>
                {form.guests} {form.guests === "1" ? "Guest" : "Guests"}
              </span>
            </div>

            <button
              type="button"
              className="aurelle-booking-submit"
              onClick={handleNewBooking}
            >
              MAKE ANOTHER REQUEST <span>↗</span>
            </button>
          </div>
        ) : (
          <form
            className="aurelle-booking-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div
                role="alert"
                style={{
                  padding: "12px 14px",
                  marginBottom: "16px",
                  border: "1px solid rgba(220, 80, 70, 0.45)",
                  borderRadius: "8px",
                  color: "#e98e84",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div className="aurelle-booking-field">
              <label htmlFor="booking-name">FULL NAME</label>
              <input
                id="booking-name"
                name="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="aurelle-booking-row">
              <div className="aurelle-booking-field">
                <label htmlFor="booking-email">EMAIL ADDRESS</label>
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={150}
                  required
                />
              </div>

              <div className="aurelle-booking-field">
                <label htmlFor="booking-phone">PHONE NUMBER</label>
                <input
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={40}
                  required
                />
              </div>
            </div>

            <div className="aurelle-booking-row">
              <div className="aurelle-booking-field">
                <label htmlFor="booking-date">DATE</label>
                <input
                  id="booking-date"
                  name="date"
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="aurelle-booking-field">
                <label htmlFor="booking-time">PREFERRED TIME</label>
                <select
                  id="booking-time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="aurelle-booking-row">
              <div className="aurelle-booking-field">
                <label htmlFor="booking-guests">NUMBER OF GUESTS</label>
                <select
                  id="booking-guests"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={String(index + 1)}>
                      {index + 1} {index === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="aurelle-booking-field">
                <label htmlFor="booking-occasion">OCCASION</label>
                <select
                  id="booking-occasion"
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                >
                  <option value="Dinner">Dinner</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business">Business dining</option>
                  <option value="Celebration">Special celebration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="aurelle-booking-field">
              <label htmlFor="booking-requests">
                SPECIAL REQUESTS <span>(OPTIONAL)</span>
              </label>
              <textarea
                id="booking-requests"
                name="requests"
                placeholder="Dietary requirements or special requests..."
                rows="3"
                value={form.requests}
                onChange={handleChange}
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className="aurelle-booking-submit"
              disabled={loading}
            >
              {loading ? "SAVING REQUEST..." : "REQUEST A RESERVATION"}
              {!loading && <span>↗</span>}
            </button>

            <p className="aurelle-booking-note">
              Demo mode: requests are saved in this browser only.
              Your table is not confirmed until approved.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
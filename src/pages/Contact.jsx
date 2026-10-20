
import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });

  const [message, setMessage] = useState("");

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.date || !form.time) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (new Date(`${form.date}T${form.time}`) <= new Date()) {
      setMessage("Please select a future date and time.");
      return;
    }

    setMessage(
      `Thank you, ${form.name.trim()}. Your demo reservation request has been received on this page. It has not been sent to the restaurant yet.`
    );
  }

  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="aurelle-contact">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">WE WOULD LOVE TO WELCOME YOU</span>
          <h1>
            Every great evening
            <br />
            <em>starts here.</em>
          </h1>
          <p>
            Questions, special occasions or a table for two?
            We look forward to helping you plan your next memorable visit.
          </p>
        </div>
      </section>

      <section className="contact-information">
        <article className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">⌖</div>
          <h2>Find Us</h2>
          <p>Canary Wharf</p>
          <p>London, United Kingdom</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Canary+Wharf%2C+London%2C+UK"
            target="_blank"
            rel="noreferrer"
          >
            VIEW LOCATION ↗
          </a>
        </article>

        <article className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">◷</div>
          <h2>Opening Hours</h2>
          <p>Opening hours to be confirmed.</p>
          <p>Please check before planning your visit.</p>
        </article>

        <article className="contact-info-card">
          <div className="contact-info-icon" aria-hidden="true">✉</div>
          <h2>Get in Touch</h2>
          <p>Contact details coming soon.</p>
          <p>Use the reservation request below for this demo.</p>
        </article>
      </section>

      <section className="contact-main">
        <div className="contact-message">
          <span className="contact-eyebrow">A TABLE, JUST FOR YOU</span>
          <h2>
            Make room for
            <br />
            <em>something special.</em>
          </h2>
          <p>
            Whether it is an intimate dinner, a gathering with friends or a
            special celebration, make your plans with AURELLE.
          </p>
          <div className="contact-message-note">
            <p>
              <strong>Please note:</strong> This is a reservation form demo.
              Your request will not be delivered to restaurant staff until
              a backend booking system is connected.
            </p>
          </div>
        </div>

        <section className="contact-reservation" id="reservation">
          <div className="contact-reservation-heading">
            <span>YOUR NEXT MEMORABLE EVENING</span>
            <h2>Reserve a table.</h2>
            <p>Share your details to preview the booking experience.</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label htmlFor="reservation-name">FULL NAME *</label>
              <input
                id="reservation-name"
                name="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={form.name}
                onChange={updateForm}
                required
              />
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="reservation-email">EMAIL ADDRESS *</label>
                <input
                  id="reservation-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="reservation-phone">PHONE NUMBER</label>
                <input
                  id="reservation-phone"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateForm}
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="reservation-date">DATE *</label>
                <input
                  id="reservation-date"
                  name="date"
                  type="date"
                  min={minimumDate}
                  value={form.date}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="reservation-time">TIME *</label>
                <select
                  id="reservation-time"
                  name="time"
                  value={form.time}
                  onChange={updateForm}
                  required
                >
                  <option value="">Choose a time</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="reservation-guests">NUMBER OF GUESTS</label>
              <select
                id="reservation-guests"
                name="guests"
                value={form.guests}
                onChange={updateForm}
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
                <option value="6">6 guests</option>
                <option value="7">7 guests</option>
                <option value="8">8 guests</option>
              </select>
            </div>

            <div className="contact-form-group">
              <label htmlFor="reservation-notes">
                SPECIAL REQUESTS (OPTIONAL)
              </label>
              <textarea
                id="reservation-notes"
                name="notes"
                placeholder="Celebration, seating preference or other details..."
                rows="4"
                value={form.notes}
                onChange={updateForm}
              />
            </div>

            {message && (
              <p
                className={
                  message.startsWith("Thank you")
                    ? "contact-form-success"
                    : "contact-form-error"
                }
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <button className="contact-form-submit" type="submit">
              SUBMIT RESERVATION REQUEST <span>↗</span>
            </button>

            <p className="contact-form-disclaimer">
              Demo only. Your details are not sent or stored by this form.
            </p>
          </form>
        </section>
      </section>

      <section className="contact-location">
        <div className="contact-location-heading">
          <span className="contact-eyebrow">OUR NEIGHBOURHOOD</span>
          <h2>Meet us in London.</h2>
          <p>Explore the Canary Wharf area on the map below.</p>
        </div>

        <div className="contact-map">
          <iframe
            title="Map of Canary Wharf, London"
            src="https://maps.google.com/maps?q=Canary%20Wharf%2C%20London%2C%20UK&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="contact-directions">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Canary+Wharf%2C+London%2C+UK"
            target="_blank"
            rel="noreferrer"
          >
            GET DIRECTIONS <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

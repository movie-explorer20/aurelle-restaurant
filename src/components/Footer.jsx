import "./Footer.css";
import { Link } from "react-router-dom";

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function ContactIcon({ type }) {
  if (type === "location") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }

  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="aurelle-footer" id="top">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            AURELLE<span>.</span>
          </Link>

          <p>
            Exceptional dining, thoughtful details, and
            unforgettable moments.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <GlobeIcon />
            </a>
          </div>
        </div>

        <nav className="footer-column" aria-label="Footer navigation">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/story">Our Story</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-column">
          <h4>Visit Us</h4>

          <p>
            <ContactIcon type="location" />
            <span>Canary Wharf, London, UK</span>
          </p>

          <a href="tel:+442079460820">
            <ContactIcon type="phone" />
            <span>+44 20 7946 0820</span>
          </a>

          <a href="mailto:hello@aurelle.example">
            <ContactIcon type="email" />
            <span>hello@aurelle.example</span>
          </a>
        </div>

        <div className="footer-reservation">
          <span className="footer-eyebrow">YOUR TABLE AWAITS</span>

          <h3>
            An evening
            <br />
            worth remembering.
          </h3>

          <Link to="/contact" className="footer-book-link">
            Reserve a Table
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AURELLE. All rights reserved.
        </p>

        <Link to="/admin" className="footer-admin-link">
          Admin Portal
          <ArrowIcon />
        </Link>

        <a href="#top" className="footer-back-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
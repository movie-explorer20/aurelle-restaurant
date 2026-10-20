
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const navigation = [
  { label: "Home", path: "/", number: "01" },
  { label: "Menu", path: "/menu", number: "02" },
  { label: "Our Story", path: "/about", number: "03" },
  { label: "Reservations", path: "/reservations", number: "04" },
  { label: "Contact", path: "/contact", number: "05" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 30);

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("aurelle-nav-locked", menuOpen);

    return () => {
      document.body.classList.remove("aurelle-nav-locked");
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={`aurelle-fx-header ${scrolled ? "is-scrolled" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="aurelle-fx-topline">
        <span className="fx-status">
          <span className="fx-status-dot" />
          <span>EXPERIENCE THE EXCEPTIONAL</span>
        </span>

        <span className="fx-topline-center">FINE DINING / EST. 2024</span>

        <span className="fx-topline-right">
          <span className="fx-topline-line" />
          CRAFTED WITH INTENTION
        </span>
      </div>

      <nav className="aurelle-fx-nav" aria-label="Main navigation">
        {/* LEFT: BRAND IDENTITY */}
        <Link
          to="/"
          className="aurelle-fx-brand"
          aria-label="Aurelle home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="fx-brand-symbol" aria-hidden="true">
            <span className="fx-symbol-orbit" />
            <span className="fx-symbol-letter">A</span>
            <span className="fx-symbol-point" />
          </span>

          <span className="fx-brand-text">
            <span className="fx-brand-name">AURELLE</span>
            <span className="fx-brand-subtitle">CULINARY HOUSE</span>
          </span>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="aurelle-fx-links">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `aurelle-fx-link ${isActive ? "active" : ""}`
              }
            >
              <span className="fx-link-number">{item.number}</span>
              <span className="fx-link-label">{item.label}</span>
              <span className="fx-link-indicator" />
            </NavLink>
          ))}
        </div>

        {/* RIGHT: RESERVATION + MOBILE CONTROL */}
        <div className="aurelle-fx-actions">
          <Link
            to="/reservations"
            className="aurelle-fx-reserve"
            onClick={() => setMenuOpen(false)}
          >
            <span className="fx-reserve-copy">
              <span className="fx-reserve-eyebrow">YOUR NEXT EXPERIENCE</span>
              <span className="fx-reserve-title">Reserve a table</span>
            </span>

            <span className="fx-reserve-icon" aria-hidden="true">
              ↗
            </span>
          </Link>

          <button
            type="button"
            className={`aurelle-fx-toggle ${menuOpen ? "is-active" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="aurelle-fx-mobile-menu"
          >
            <span className="fx-toggle-icon">
              <span />
              <span />
            </span>
            <span className="fx-toggle-label">
              {menuOpen ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </nav>

      <div className="aurelle-fx-bottomline">
        <span className="fx-bottomline-start" />
        <span className="fx-bottomline-glow" />
        <span className="fx-bottomline-end" />
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className={`aurelle-fx-mobile-backdrop ${
          menuOpen ? "is-visible" : ""
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="aurelle-fx-mobile-menu"
        className={`aurelle-fx-mobile-panel ${
          menuOpen ? "is-open" : ""
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="fx-mobile-panel-head">
          <span>THE AURELLE EXPERIENCE</span>
          <span className="fx-mobile-panel-index">NAV / 001</span>
        </div>

        <div className="fx-mobile-links">
          {navigation.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `fx-mobile-link ${isActive ? "active" : ""}`
              }
              style={{ "--fx-index": index }}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="fx-mobile-number">{item.number}</span>
              <span className="fx-mobile-label">{item.label}</span>
              <span className="fx-mobile-arrow" aria-hidden="true">
                ↗
              </span>
            </NavLink>
          ))}
        </div>

        <Link
          to="/reservations"
          className="fx-mobile-reserve"
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        >
          <span>RESERVE YOUR EXPERIENCE</span>
          <span aria-hidden="true">↗</span>
        </Link>

        <div className="fx-mobile-panel-footer">
          <span>
            <span className="fx-status-dot" /> AURELLE / ONLINE
          </span>
          <span>EST. 2024</span>
        </div>
      </div>
    </header>
  );
}

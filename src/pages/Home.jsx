
import { Link } from "react-router-dom";
import "./Home.css";

const highlights = [
  {
    number: "01",
    title: "Seasonal Ingredients",
    description:
      "Thoughtfully selected ingredients, celebrated at their freshest and transformed into memorable dishes.",
    symbol: "✳",
  },
  {
    number: "02",
    title: "Artful Cuisine",
    description:
      "A refined approach to contemporary dining, where every detail has a purpose and every plate tells a story.",
    symbol: "✧",
  },
  {
    number: "03",
    title: "Exceptional Service",
    description:
      "Warm hospitality, considered details and an atmosphere designed to make every visit feel special.",
    symbol: "◇",
  },
];

const signatureDishes = [
  {
    number: "01",
    name: "The Signature Experience",
    category: "CHEF'S SELECTION",
    description:
      "An elegant composition of seasonal flavours, delicate textures and carefully balanced ingredients.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  },
  {
    number: "02",
    name: "A Taste of the Season",
    category: "SEASONAL CREATION",
    description:
      "Inspired by the finest ingredients of the season and the beauty of understated presentation.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    number: "03",
    name: "The Final Indulgence",
    category: "DESSERT",
    description:
      "A delicate finishing touch created to make the final moments of your evening unforgettable.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function Home() {
  return (
    <div className="aurelle-home">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-background" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90"
            alt=""
            fetchPriority="high"
          />
        </div>

        <div className="home-hero-overlay" />

        <div className="home-hero-content">
          <span className="home-eyebrow">
            <span className="home-eyebrow-line" />
            A NEW PERSPECTIVE ON FINE DINING
          </span>

          <h1>
            An evening
            <br />
            <span>to remember.</span>
          </h1>

          <p className="home-hero-description">
            Discover a world where exceptional cuisine, thoughtful
            hospitality and timeless elegance come together.
          </p>

          <div className="home-hero-actions">
            <Link
              to="/contact#reservation"
              className="home-button home-button-primary"
            >
              <span>RESERVE YOUR TABLE</span>
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/menu"
              className="home-button home-button-outline"
            >
              EXPLORE THE MENU
            </Link>
          </div>
        </div>

        <div className="home-hero-bottom">
          <span>AN EXPERIENCE BEYOND THE ORDINARY</span>
          <a href="#home-introduction" aria-label="Scroll to discover">
            <span>SCROLL TO DISCOVER</span>
            <span className="home-scroll-icon" aria-hidden="true">
              ↓
            </span>
          </a>
          <span className="home-hero-location">
            CANARY WHARF · LONDON
          </span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section
        id="home-introduction"
        className="home-introduction"
      >
        <div className="home-section-label">
          <span>01</span>
          <span className="home-label-line" />
          <span>THE AURELLE PHILOSOPHY</span>
        </div>

        <div className="home-introduction-grid">
          <div className="home-introduction-heading">
            <span className="home-gold-kicker">
              MORE THAN A MEAL
            </span>

            <h2>
              Where moments
              <br />
              become <em>memories.</em>
            </h2>
          </div>

          <div className="home-introduction-copy">
            <p>
              At AURELLE, dining is an art shaped by flavour,
              atmosphere and the people who bring a table to life.
              Every detail is considered. Every moment matters.
            </p>

            <Link to="/story" className="home-text-link">
              <span>DISCOVER OUR STORY</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="home-introduction-image">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
            alt="Elegant restaurant interior prepared for an evening of dining"
            loading="lazy"
          />

          <div className="home-image-caption">
            <span>THE AURELLE ATMOSPHERE</span>
            <span>01 / 03</span>
          </div>
        </div>
      </section>

      {/* SIGNATURE SELECTION */}
      <section className="home-signature">
        <div className="home-section-label">
          <span>02</span>
          <span className="home-label-line" />
          <span>CURATED WITH INTENTION</span>
        </div>

        <div className="home-section-heading">
          <div>
            <span className="home-gold-kicker">
              A TASTE OF AURELLE
            </span>

            <h2>
              The art of
              <br />
              <em>exceptional flavour.</em>
            </h2>
          </div>

          <Link to="/menu" className="home-text-link">
            <span>VIEW FULL MENU</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="home-dishes-grid">
          {signatureDishes.map((dish) => (
            <article className="home-dish-card" key={dish.number}>
              <Link
                to="/menu"
                className="home-dish-image"
                aria-label={`Explore the menu: ${dish.name}`}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                />

                <span className="home-dish-number">
                  {dish.number}
                </span>

                <span className="home-dish-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>

              <div className="home-dish-content">
                <span className="home-dish-category">
                  {dish.category}
                </span>

                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="home-menu-note">
          Our selection may change with the seasons and ingredient
          availability. Explore the menu for more.
        </p>
      </section>

      {/* PHILOSOPHY / EXPERIENCE */}
      <section className="home-experience">
        <div className="home-experience-image">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85"
            alt="Warmly lit fine dining setting"
            loading="lazy"
          />
          <span className="home-experience-image-caption">
            CONSIDERED IN EVERY DETAIL
          </span>
        </div>

        <div className="home-experience-content">
          <div className="home-section-label">
            <span>03</span>
            <span className="home-label-line" />
            <span>THE EXPERIENCE</span>
          </div>

          <span className="home-gold-kicker">
            TIME WELL SPENT
          </span>

          <h2>
            Slow down.
            <br />
            <em>Savour more.</em>
          </h2>

          <p>
            Step away from the everyday and into an atmosphere
            designed for meaningful conversations, thoughtful
            service and unforgettable evenings.
          </p>

          <Link to="/experience" className="home-button home-button-primary">
            <span>DISCOVER THE EXPERIENCE</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* WHY AURELLE */}
      <section className="home-highlights">
        <div className="home-section-label">
          <span>04</span>
          <span className="home-label-line" />
          <span>OUR PROMISE</span>
        </div>

        <div className="home-section-heading">
          <div>
            <span className="home-gold-kicker">
              THE DETAILS MAKE THE DIFFERENCE
            </span>

            <h2>
              Made with care.
              <br />
              <em>Remembered forever.</em>
            </h2>
          </div>
        </div>

        <div className="home-highlights-grid">
          {highlights.map((item) => (
            <article
              className="home-highlight-card"
              key={item.number}
            >
              <div className="home-highlight-top">
                <span className="home-highlight-number">
                  {item.number}
                </span>

                <span className="home-highlight-symbol" aria-hidden="true">
                  {item.symbol}
                </span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <Link to="/story" className="home-text-link home-highlights-link">
          <span>GET TO KNOW AURELLE</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="home-gallery-preview">
        <div className="home-gallery-heading">
          <div>
            <span className="home-gold-kicker">
              A GLIMPSE INTO OUR WORLD
            </span>

            <h2>
              Beauty in
              <br />
              <em>every detail.</em>
            </h2>
          </div>

          <Link to="/gallery" className="home-text-link">
            <span>EXPLORE THE GALLERY</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="home-gallery-grid">
          <Link to="/gallery" className="home-gallery-item home-gallery-large">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1300&q=85"
              alt="AURELLE-inspired restaurant ambience"
              loading="lazy"
            />
            <span>THE ATMOSPHERE ↗</span>
          </Link>

          <Link to="/gallery" className="home-gallery-item">
            <img
              src="https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=900&q=85"
              alt="Seasonal culinary inspiration"
              loading="lazy"
            />
            <span>THE CUISINE ↗</span>
          </Link>

          <Link to="/gallery" className="home-gallery-item">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85"
              alt="An elegant dining table"
              loading="lazy"
            />
            <span>THE EXPERIENCE ↗</span>
          </Link>
        </div>
      </section>

      {/* FINAL RESERVATION CTA */}
      <section className="home-reservation-cta">
        <div className="home-cta-decoration" aria-hidden="true">
          A
        </div>

        <div className="home-cta-content">
          <span className="home-gold-kicker">
            YOUR TABLE IS WAITING
          </span>

          <h2>
            Make it an
            <br />
            <em>evening to remember.</em>
          </h2>

          <p>
            Gather your favourite people. Let us take care of the
            details. Your next memorable evening begins at AURELLE.
          </p>

          <Link
            to="/contact#reservation"
            className="home-button home-button-primary"
          >
            <span>RESERVE YOUR TABLE</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <span className="home-cta-location">
            CANARY WHARF · LONDON, UNITED KINGDOM
          </span>
        </div>
      </section>
    </div>
  );
}

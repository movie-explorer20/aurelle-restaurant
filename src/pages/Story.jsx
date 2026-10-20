
import { Link } from "react-router-dom";
import "./Story.css";

const values = [
  {
    number: "01",
    title: "Exceptional Ingredients",
    description:
      "We celebrate thoughtfully selected ingredients and let their natural character shine.",
  },
  {
    number: "02",
    title: "Considered Craft",
    description:
      "Every plate is an opportunity to bring flavour, technique and creativity together.",
  },
  {
    number: "03",
    title: "Genuine Hospitality",
    description:
      "We believe the smallest details can turn a lovely evening into a lasting memory.",
  },
];

export default function Story() {
  return (
    <main className="story-page">
      <section className="story-hero">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=90"
          alt="An elegant restaurant prepared for dinner"
        />
        <div className="story-hero-overlay" />

        <div className="story-hero-content">
          <span>OUR STORY · OUR PHILOSOPHY</span>
          <h1>
            Created with
            <br />
            <em>intention.</em>
          </h1>
          <p>
            A place where food brings people together and every
            detail makes a difference.
          </p>
        </div>

        <span className="story-hero-index">EST. IN THE SPIRIT OF HOSPITALITY</span>
      </section>

      <section className="story-introduction">
        <div className="story-section-label">
          <span />
          THE IDEA BEHIND AURELLE
        </div>

        <div className="story-intro-grid">
          <h2>
            More than a place.
            <br />
            <em>A state of mind.</em>
          </h2>

          <div className="story-intro-copy">
            <p>
              AURELLE is built around a simple idea: the best dining
              experiences are about more than what is on the plate.
              They are about the people beside you, the atmosphere
              around you and the time you take to enjoy it all.
            </p>
            <p>
              Our approach brings together considered cuisine,
              welcoming service and a setting that invites you to
              slow down and stay a little longer.
            </p>
          </div>
        </div>
      </section>

      <section className="story-visual">
        <div className="story-visual-image">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85"
            alt="Warmly lit restaurant interior"
            loading="lazy"
          />
        </div>

        <div className="story-visual-copy">
          <span>01 — THE ATMOSPHERE</span>
          <h2>
            Elegance that
            <br />
            feels <em>effortless.</em>
          </h2>
          <p>
            Warm lighting, considered details and an inviting
            atmosphere create the perfect setting for everything
            from intimate dinners to special celebrations.
          </p>
        </div>
      </section>

      <section className="story-values">
        <div className="story-section-label">
          <span />
          WHAT GUIDES US
        </div>

        <h2>
          Our values, in <em>every detail.</em>
        </h2>

        <div className="story-values-grid">
          {values.map((value) => (
            <article className="story-value-card" key={value.number}>
              <span>{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-closing">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=85"
          alt="A welcoming restaurant ready for guests"
          loading="lazy"
        />
        <div className="story-closing-overlay" />
        <div className="story-closing-content">
          <span>YOUR PLACE AT OUR TABLE</span>
          <h2>
            We'd love to
            <br />
            welcome <em>you.</em>
          </h2>
          <Link to="/contact#reservation">
            RESERVE YOUR TABLE <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

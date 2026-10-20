
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const categories = ["All", "Starters", "Mains", "Desserts", "Drinks"];

const dishes = [
  {
    id: 1,
    name: "Golden Burrata",
    category: "Starters",
    price: 19,
    description: "Creamy burrata, heritage tomatoes, basil oil.",
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1100&q=90",
    tag: "A HOUSE FAVOURITE",
  },
  {
    id: 2,
    name: "Wild Mushroom Toast",
    category: "Starters",
    price: 16,
    description: "Wild mushrooms, toasted sourdough, fresh herbs.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1100&q=90",
    tag: "SEASONAL",
  },
  {
    id: 3,
    name: "The Signature Steak",
    category: "Mains",
    price: 38,
    description: "Prime-cut steak, seasonal vegetables, peppercorn jus.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1100&q=90",
    tag: "CHEF'S SELECTION",
  },
  {
    id: 4,
    name: "Garden Risotto",
    category: "Mains",
    price: 26,
    description: "Creamy arborio rice, garden herbs, aged parmesan.",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1100&q=90",
    tag: "VEGETARIAN",
  },
  {
    id: 5,
    name: "Roasted Salmon",
    category: "Mains",
    price: 31,
    description: "Roasted salmon, greens, lemon butter sauce.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1100&q=90",
    tag: "FROM THE SEA",
  },
  {
    id: 6,
    name: "Midnight Chocolate",
    category: "Desserts",
    price: 14,
    description: "Rich chocolate, delicate textures, seasonal berries.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=90",
    tag: "A SWEET FINISH",
  },
  {
    id: 7,
    name: "Vanilla Panna Cotta",
    category: "Desserts",
    price: 12,
    description: "Vanilla cream, berry compote, crisp sugar.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=90",
    tag: "HOUSE CLASSIC",
  },
  {
    id: 8,
    name: "Golden Citrus Cooler",
    category: "Drinks",
    price: 9,
    description: "Fresh citrus, sparkling water, aromatic mint.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1100&q=90",
    tag: "REFRESHING",
  },
  {
    id: 9,
    name: "Velvet Berry Blend",
    category: "Drinks",
    price: 11,
    description: "A vibrant berry blend with delicate botanical notes.",
    image:
      "https://images.unsplash.com/photo-1536935338788846bb9981813?auto=format&fit=crop&w=1100&q=90",
    tag: "HOUSE SIGNATURE",
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDishes =
    activeCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === activeCategory);

  return (
    <main className="aurelle-menu-page">
      {/* HERO */}
      <section className="menu-hero">
        <div className="menu-hero-image" />
        <div className="menu-hero-overlay" />

        <div className="menu-hero-content">
          <span className="menu-eyebrow">
            <span className="menu-eyebrow-line" />
            THE AURELLE EXPERIENCE
          </span>

          <h1>
            An artful approach
            <br />
            to <em>every flavour.</em>
          </h1>

          <p>
            Beautiful ingredients. Thoughtful craftsmanship.
            Unforgettable moments, served one plate at a time.
          </p>

          <a href="#menu-collection" className="menu-hero-link">
            EXPLORE THE MENU
            <span className="menu-link-arrow">↘</span>
          </a>
        </div>

        <div className="menu-hero-caption">
          <span>SEASONAL · THOUGHTFUL · DISTINCTIVE</span>
          <span>01 — THE COLLECTION</span>
        </div>

        <div className="menu-hero-index">A.</div>
      </section>

      {/* INTRODUCTION */}
      <section className="menu-introduction">
        <div className="menu-intro-mark">A</div>

        <span className="menu-eyebrow">
          <span className="menu-eyebrow-line" />
          OUR KITCHEN, OUR PHILOSOPHY
        </span>

        <h2>
          Good food deserves
          <br />
          <em>your full attention.</em>
        </h2>

        <p>
          Inspired by seasonal ingredients and the art of fine dining,
          every creation is a celebration of flavour, texture and
          the simple pleasure of sharing a beautiful meal.
        </p>

        <div className="menu-intro-divider">
          <span />
          <span className="menu-divider-diamond">◆</span>
          <span />
        </div>
      </section>

      {/* MENU COLLECTION */}
      <section className="menu-collection" id="menu-collection">
        <div className="menu-collection-heading">
          <div className="menu-heading-copy">
            <span className="menu-eyebrow">
              <span className="menu-eyebrow-line" />
              CURATED FOR YOUR PALATE
            </span>

            <h2>
              Explore our <em>menu.</em>
            </h2>

            <p>
              Find your favourite, or discover something entirely new.
            </p>
          </div>

          <div className="menu-collection-count">
            <span className="menu-count-number">
              {String(filteredDishes.length).padStart(2, "0")}
            </span>
            <span className="menu-count-label">
              {activeCategory === "All"
                ? "SIGNATURE CREATIONS"
                : activeCategory.toUpperCase()}
            </span>
          </div>
        </div>

        <div
          className="menu-category-filters"
          aria-label="Filter dishes by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "menu-filter active"
                  : "menu-filter"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
              <span className="menu-filter-dot" />
            </button>
          ))}
        </div>

        <div className="menu-dishes-grid" aria-live="polite">
          {filteredDishes.map((dish, index) => (
            <article
              className="menu-dish-card"
              key={dish.id}
              style={{ "--dish-index": index }}
            >
              <div className="menu-dish-photo">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading={index < 3 ? "eager" : "lazy"}
                />

                <div className="menu-photo-shade" />

                <span className="menu-dish-tag">{dish.tag}</span>

                <span className="menu-dish-number">
                  {String(dish.id).padStart(2, "0")}
                </span>

                <span className="menu-photo-category">
                  {dish.category}
                </span>
              </div>

              <div className="menu-dish-details">
                <div className="menu-dish-title-row">
                  <h3>{dish.name}</h3>
                  <span className="menu-dish-price">
                    <span className="menu-price-currency">£</span>
                    {dish.price}
                  </span>
                </div>

                <p>{dish.description}</p>

                <div className="menu-dish-bottom">
                  <span className="menu-dish-category">
                    {dish.category}
                  </span>

                  <span className="menu-card-accent" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <p className="menu-empty-state">
            New creations are coming soon. Please explore another category.
          </p>
        )}

        <div className="menu-collection-footer">
          <span>MADE WITH INTENTION. SERVED WITH CARE.</span>
          <span>AURELLE <span className="menu-footer-star">✳</span> FINE DINING</span>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="menu-experience">
        <div className="menu-experience-image" />
        <div className="menu-experience-overlay" />

        <div className="menu-experience-content">
          <span className="menu-eyebrow">
            <span className="menu-eyebrow-line" />
            AN EVENING TO REMEMBER
          </span>

          <h2>
            The table is set
            <br />
            <em>for you.</em>
          </h2>

          <p>
            Bring your favourite people together.
            We’ll take care of the details.
          </p>

          <Link
            to="/contact#reservation"
            className="menu-reserve-button"
          >
            RESERVE YOUR TABLE
            <span>↗</span>
          </Link>
        </div>

        <span className="menu-experience-index">AURELLE / 2026</span>
      </section>
    </main>
  );
}

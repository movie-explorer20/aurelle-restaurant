
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminMenu.css";

const STORAGE_KEY = "aurelle_admin_menu_v1";

const initialDishes = [
  {
    id: "dish-1",
    name: "Golden Burrata",
    category: "Starters",
    price: 19,
    description: "Creamy burrata, heritage tomatoes, basil oil.",
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=85",
    tag: "A HOUSE FAVOURITE",
    available: true,
  },
  {
    id: "dish-2",
    name: "Wild Mushroom Toast",
    category: "Starters",
    price: 16,
    description: "Wild mushrooms, toasted sourdough, fresh herbs.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
    tag: "SEASONAL",
    available: true,
  },
  {
    id: "dish-3",
    name: "The Signature Steak",
    category: "Mains",
    price: 38,
    description: "Prime-cut steak, seasonal vegetables, peppercorn jus.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
    tag: "CHEF'S SELECTION",
    available: true,
  },
  {
    id: "dish-4",
    name: "Garden Risotto",
    category: "Mains",
    price: 26,
    description: "Creamy arborio rice, garden herbs, aged parmesan.",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=85",
    tag: "VEGETARIAN",
    available: true,
  },
  {
    id: "dish-5",
    name: "Roasted Salmon",
    category: "Mains",
    price: 31,
    description: "Roasted salmon, greens, lemon butter sauce.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85",
    tag: "FROM THE SEA",
    available: true,
  },
  {
    id: "dish-6",
    name: "Midnight Chocolate",
    category: "Desserts",
    price: 14,
    description: "Rich chocolate, delicate textures, seasonal berries.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    tag: "A SWEET FINISH",
    available: true,
  },
  {
    id: "dish-7",
    name: "Vanilla Panna Cotta",
    category: "Desserts",
    price: 12,
    description: "Vanilla cream, berry compote, crisp sugar.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
    tag: "HOUSE CLASSIC",
    available: true,
  },
  {
    id: "dish-8",
    name: "Golden Citrus Cooler",
    category: "Drinks",
    price: 9,
    description: "Fresh citrus, sparkling water, aromatic mint.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85",
    tag: "REFRESHING",
    available: true,
  },
  {
    id: "dish-9",
    name: "Velvet Berry Blend",
    category: "Drinks",
    price: 11,
    description: "A vibrant berry blend with delicate botanical notes.",
    image:
      "https://images.unsplash.com/photo-1536935338788846bb9981813?auto=format&fit=crop&w=900&q=85",
    tag: "HOUSE SIGNATURE",
    available: true,
  },
];

const categories = ["All", "Starters", "Mains", "Desserts", "Drinks"];

const emptyForm = {
  name: "",
  category: "Mains",
  price: "",
  description: "",
  image: "",
  tag: "CHEF'S SELECTION",
  available: true,
};

function readSavedDishes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Use sample data if saved data cannot be read.
  }

  return initialDishes;
}

export default function AdminMenu() {
  const [dishes, setDishes] = useState(readSavedDishes);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
    } catch {
      setNotice("Could not save changes in this browser.");
    }
  }, [dishes]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const stats = useMemo(() => ({
    total: dishes.length,
    available: dishes.filter((dish) => dish.available).length,
    unavailable: dishes.filter((dish) => !dish.available).length,
    categories: new Set(dishes.map((dish) => dish.category)).size,
  }), [dishes]);

  const filteredDishes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesCategory =
        activeCategory === "All" || dish.category === activeCategory;

      const matchesSearch =
        !query ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query);

      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && dish.available) ||
        (availabilityFilter === "Unavailable" && !dish.available);

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [dishes, activeCategory, search, availabilityFilter]);

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEditModal(dish) {
    setEditingId(dish.id);
    setForm({
      name: dish.name,
      category: dish.category,
      price: String(dish.price),
      description: dish.description,
      image: dish.image,
      tag: dish.tag || "",
      available: dish.available,
    });
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function saveDish(event) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const image = form.image.trim();
    const price = Number(form.price);

    if (!name || !description || !image || !Number.isFinite(price) || price < 0) {
      setNotice("Please complete all required fields with a valid price.");
      return;
    }

    const dishData = {
      ...form,
      name,
      description,
      image,
      price,
      tag: form.tag.trim() || "CHEF'S SELECTION",
    };

    if (editingId) {
      setDishes((current) =>
        current.map((dish) =>
          dish.id === editingId ? { ...dish, ...dishData } : dish
        )
      );
      setNotice("Dish updated successfully.");
    } else {
      setDishes((current) => [
        { ...dishData, id: `dish-${Date.now()}` },
        ...current,
      ]);
      setNotice("New dish added to the admin menu.");
    }

    setModalOpen(false);
  }

  function toggleAvailability(id) {
    setDishes((current) =>
      current.map((dish) =>
        dish.id === id ? { ...dish, available: !dish.available } : dish
      )
    );
    setNotice("Availability updated.");
  }

  function deleteDish(dish) {
    const confirmed = window.confirm(
      `Delete "${dish.name}" from this admin menu? This cannot be undone.`
    );

    if (!confirmed) return;

    setDishes((current) => current.filter((item) => item.id !== dish.id));
    setNotice("Dish deleted.");
  }

  return (
    <main className="aurelle-admin">
      <aside className="am-sidebar">
        <Link to="/" className="am-brand" aria-label="Aurelle home">
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
          <Link to="/admin/menu" className="am-nav-link active">
            <span className="am-nav-icon">♧</span>
            Menu management
            <span className="am-nav-indicator" />
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
              <strong>Workspace ready</strong>
              <small>Local browser storage</small>
            </div>
          </div>
          <Link to="/menu" className="am-public-link">
            <span>↗</span> View public menu
          </Link>
          <Link to="/" className="am-back-home">← Back to website</Link>
        </div>
      </aside>

      <section className="am-main">
        <header className="am-topbar">
          <div className="am-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Menu management</strong>
          </div>
          <div className="am-topbar-right">
            <span className="am-live-dot" />
            <span>ADMIN WORKSPACE</span>
            <div className="am-avatar">A</div>
          </div>
        </header>

        <div className="am-content">
          <section className="am-page-heading">
            <div>
              <span className="am-eyebrow">AURELLE / OPERATIONS</span>
              <h1>Menu <em>management.</em></h1>
              <p>Curate your collection. Keep every detail exceptional.</p>
            </div>
            <button className="am-primary-btn" onClick={openAddModal}>
              <span>＋</span> Add new dish
            </button>
          </section>

          {notice && (
            <div className="am-notice" role="status">
              <span>✦</span> {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          <section className="am-stats" aria-label="Menu statistics">
            <article className="am-stat-card">
              <span className="am-stat-icon">♧</span>
              <span className="am-stat-label">TOTAL DISHES</span>
              <strong>{stats.total.toString().padStart(2, "0")}</strong>
              <small>Items in your collection</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon am-stat-green">✓</span>
              <span className="am-stat-label">AVAILABLE NOW</span>
              <strong>{stats.available.toString().padStart(2, "0")}</strong>
              <small>Ready to be served</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon am-stat-red">−</span>
              <span className="am-stat-label">UNAVAILABLE</span>
              <strong>{stats.unavailable.toString().padStart(2, "0")}</strong>
              <small>Currently switched off</small>
            </article>
            <article className="am-stat-card">
              <span className="am-stat-icon">◇</span>
              <span className="am-stat-label">CATEGORIES</span>
              <strong>{stats.categories.toString().padStart(2, "0")}</strong>
              <small>Menu collections</small>
            </article>
          </section>

          <section className="am-menu-panel">
            <div className="am-panel-heading">
              <div>
                <span className="am-eyebrow">THE COLLECTION</span>
                <h2>Your dishes <span>({filteredDishes.length})</span></h2>
              </div>
              <span className="am-panel-note">LIVE IN THIS BROWSER</span>
            </div>

            <div className="am-toolbar">
              <label className="am-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dishes..."
                  aria-label="Search dishes"
                />
              </label>

              <label className="am-select-wrap">
                <span className="am-sr-only">Availability</span>
                <select
                  value={availabilityFilter}
                  onChange={(event) => setAvailabilityFilter(event.target.value)}
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </label>
            </div>

            <div className="am-category-tabs" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "active" : ""}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredDishes.length ? (
              <div className="am-dish-grid">
                {filteredDishes.map((dish) => (
                  <article className="am-dish-card" key={dish.id}>
                    <div className="am-dish-image">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.opacity = "0.15";
                        }}
                      />
                      <span className="am-dish-tag">{dish.tag || dish.category}</span>
                      <span
                        className={
                          dish.available
                            ? "am-availability available"
                            : "am-availability unavailable"
                        }
                      >
                        <span />
                        {dish.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="am-dish-info">
                      <div className="am-dish-meta">
                        <span>{dish.category}</span>
                        <span className="am-dish-id">
                          {String(dish.id).slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h3>{dish.name}</h3>
                      <p>{dish.description}</p>

                      <div className="am-dish-footer">
                        <strong>£{Number(dish.price).toFixed(2)}</strong>
                        <div className="am-dish-actions">
                          <button
                            type="button"
                            className="am-icon-btn"
                            onClick={() => openEditModal(dish)}
                            aria-label={`Edit ${dish.name}`}
                            title="Edit dish"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className={
                              dish.available
                                ? "am-icon-btn am-toggle-on"
                                : "am-icon-btn"
                            }
                            onClick={() => toggleAvailability(dish.id)}
                            aria-label={`${
                              dish.available ? "Mark unavailable" : "Mark available"
                            }: ${dish.name}`}
                            title={dish.available ? "Mark unavailable" : "Mark available"}
                          >
                            {dish.available ? "✓" : "○"}
                          </button>
                          <button
                            type="button"
                            className="am-icon-btn am-delete-btn"
                            onClick={() => deleteDish(dish)}
                            aria-label={`Delete ${dish.name}`}
                            title="Delete dish"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="am-empty">
                <span>◇</span>
                <h3>No dishes found</h3>
                <p>Try another search or add a new dish to your collection.</p>
                <button className="am-primary-btn" onClick={openAddModal}>
                  ＋ Add a dish
                </button>
              </div>
            )}
          </section>

          <footer className="am-footer">
            <span>© AURELLE — RESTAURANT CONTROL</span>
            <span>CRAFTED WITH INTENTION <b>✳</b></span>
          </footer>
        </div>
      </section>

      {modalOpen && (
        <div
          className="am-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="am-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="am-modal-title"
          >
            <header className="am-modal-header">
              <div>
                <span className="am-eyebrow">
                  AURELLE / MENU EDITOR
                </span>
                <h2 id="am-modal-title">
                  {editingId ? "Refine your dish." : "Create a dish."}
                </h2>
                <p>Every detail matters. Make it exceptional.</p>
              </div>
              <button
                type="button"
                className="am-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </header>

            <form className="am-form" onSubmit={saveDish}>
              <div className="am-form-grid">
                <label className="am-field am-field-full">
                  <span>Dish name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Truffle Tagliatelle"
                    maxLength={80}
                    required
                  />
                </label>

                <label className="am-field">
                  <span>Category *</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    required
                  >
                    {categories.filter((category) => category !== "All").map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="am-field">
                  <span>Price (£) *</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={updateField}
                    placeholder="24.00"
                    required
                  />
                </label>

                <label className="am-field am-field-full">
                  <span>Description *</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    placeholder="Describe the ingredients and flavours..."
                    rows="3"
                    maxLength={240}
                    required
                  />
                </label>

                <label className="am-field am-field-full">
                  <span>Food image URL *</span>
                  <input
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={updateField}
                    placeholder="https://example.com/dish.jpg"
                    required
                  />
                </label>

                {form.image.trim() && (
                  <div className="am-image-preview am-field-full">
                    <span>IMAGE PREVIEW</span>
                    <img
                      src={form.image}
                      alt="Dish preview"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                      onLoad={(event) => {
                        event.currentTarget.style.visibility = "visible";
                      }}
                    />
                  </div>
                )}

                <label className="am-field am-field-full">
                  <span>Label / tag</span>
                  <input
                    name="tag"
                    value={form.tag}
                    onChange={updateField}
                    placeholder="CHEF'S SELECTION"
                    maxLength={40}
                  />
                </label>

                <label className="am-availability-field am-field-full">
                  <input
                    name="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={updateField}
                  />
                  <span className="am-checkmark">✓</span>
                  <span>
                    <strong>Available to order</strong>
                    <small>Turn off if the dish is temporarily unavailable.</small>
                  </span>
                </label>
              </div>

              <div className="am-form-actions">
                <button
                  type="button"
                  className="am-secondary-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="am-primary-btn">
                  {editingId ? "Save changes" : "Create dish"} <span>↗</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

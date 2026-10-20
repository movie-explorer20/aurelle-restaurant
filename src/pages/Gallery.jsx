
import { Link } from "react-router-dom";
import "./Gallery.css";

const galleryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    title: "The Dining Room",
    category: "OUR SPACE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
    title: "An Evening Together",
    category: "THE EXPERIENCE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=85",
    title: "The Art of Dining",
    category: "AMBIENCE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1000&q=85",
    title: "Crafted with Care",
    category: "FROM OUR KITCHEN",
  },
  {
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
    title: "Beautiful Details",
    category: "THE LITTLE THINGS",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1000&q=85",
    title: "A Taste to Remember",
    category: "OUR CUISINE",
  },
];

export default function Gallery() {
  return (
    <main className="aurelle-gallery">
      <section className="gallery-heading">
        <span>THE WORLD OF AURELLE</span>
        <h1>
          Moments in <em>focus.</em>
        </h1>
        <p>
          A glimpse into our spaces, our cuisine and the moments
          that make every visit special.
        </p>
      </section>

      <section className="gallery-grid">
        {galleryImages.map((item, index) => (
          <article className="gallery-card" key={item.title}>
            <div className="gallery-image">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
              <span className="gallery-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="gallery-caption">
              <div>
                <span>{item.category}</span>
                <h2>{item.title}</h2>
              </div>
              <span className="gallery-arrow">↗</span>
            </div>
          </article>
        ))}
      </section>

      <section className="gallery-cta">
        <span>YOUR MOMENT STARTS HERE</span>
        <h2>
          Be part of the <em>story.</em>
        </h2>
        <Link to="/contact#reservation">
          RESERVE YOUR TABLE <span>↗</span>
        </Link>
      </section>
    </main>
  );
}


import { Sparkles, Wine, Music, Heart } from "lucide-react";
import "./Experience.css";

export default function Experience() {
  return (
    <main style={{ background: "#11110f", color: "#f6f1e8", minHeight: "80vh", padding: "100px 8%" }}>
      <p style={{ color: "#d7b77b", letterSpacing: "3px", fontSize: "11px" }}>
        MORE THAN A DINNER
      </p>

      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(42px, 7vw, 76px)", fontWeight: 400 }}>
        The AURELLE <em style={{ color: "#d7b77b" }}>experience.</em>
      </h1>

      <p style={{ maxWidth: "620px", color: "#b5b0a5", lineHeight: 1.9 }}>
        Discover an atmosphere designed for meaningful conversations,
        memorable celebrations and exceptional dining.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", marginTop: "55px" }}>
        <article><Sparkles color="#d7b77b" size={28} /><h2>Elegant Atmosphere</h2><p>Thoughtful details and a warm, refined setting.</p></article>
        <article><Wine color="#d7b77b" size={28} /><h2>Fine Dining</h2><p>A menu celebrating flavour and quality ingredients.</p></article>
        <article><Music color="#d7b77b" size={28} /><h2>Evening Ambience</h2><p>A welcoming environment for your special evening.</p></article>
        <article><Heart color="#d7b77b" size={28} /><h2>Personal Touch</h2><p>Hospitality designed around every guest.</p></article>
      </div>
    </main>
  );
}

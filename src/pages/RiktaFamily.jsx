// src/pages/RiktaFamily.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function RiktaFamily() {
  return (
    <div>
      <Navbar mode="subpage" />

      <section className="page">
        <div className="container">
          <h2>Rikta's Family Photos</h2>
          <p className="muted">Family gallery — add family photos to <code>public/</code> and link them here later.</p>

          <div className="gallery-grid" style={{ marginTop: 18 }}>
            <div className="thumb reveal"><div style={{ padding: 36, textAlign: "center" }}>👪</div></div>
            <div className="thumb reveal" style={{ animationDelay: "60ms" }}><div style={{ padding: 36, textAlign: "center" }}>📷</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}

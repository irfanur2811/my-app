// src/pages/RiktaVideos.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function RiktaVideos() {
  return (
    <div>
      <Navbar mode="subpage" />

      <section className="page">
        <div className="container">
          <h2>Rikta's Videos</h2>
          <p className="muted">Video gallery placeholder — add video embeds here later.</p>

          <div className="video-grid" style={{ marginTop: 18 }}>
            <article className="video-card reveal">
              <div className="video-thumb">🎞️</div>
              <h4>Sample Video 1</h4>
              <p className="muted small">Add video URL or embed here.</p>
            </article>

            <article className="video-card reveal" style={{ animationDelay: "80ms" }}>
              <div className="video-thumb">🎞️</div>
              <h4>Sample Video 2</h4>
              <p className="muted small">Add video URL or embed here.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

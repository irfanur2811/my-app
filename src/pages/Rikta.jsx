// src/pages/Rikta.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

export default function Rikta() {
  const [photos, setPhotos] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1); // -1 = closed
  const total = 13; // g1..g13

  useEffect(() => {
    const list = Array.from({ length: total }, (_, i) => `/g${i + 1}.jpg`);
    setPhotos(list);
  }, []);

  // open modal at index
  function openAt(i) {
    setOpenIndex(i);
    // prevent background scroll
    document.body.style.overflow = "hidden";
  }

  // close modal
  const closeModal = useCallback(() => {
    setOpenIndex(-1);
    document.body.style.overflow = "";
  }, []);

  // prev/next with wrap
  const prev = useCallback(() => {
    setOpenIndex((cur) => (cur <= 0 ? photos.length - 1 : cur - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setOpenIndex((cur) => (cur >= photos.length - 1 ? 0 : cur + 1));
  }, [photos.length]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (openIndex === -1) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, prev, next, closeModal]);

  // click on overlay to close (handler on overlay element)
  function onOverlayClick(e) {
    if (e.target.dataset.lightbox === "overlay") closeModal();
  }

  // download current image
  function downloadCurrent() {
    if (openIndex < 0) return;
    const url = photos[openIndex];
    // Create anchor and click to download
    const a = document.createElement("a");
    a.href = url;
    // filename like rikta-g5.jpg
    a.download = `rikta-${openIndex + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="page">
      <div className="container">
        <h2>Rikta's Gallery</h2>
        <p className="muted">Click any photo to open the viewer — use arrow keys or buttons to navigate.</p>

        <div className="gallery-grid">
          {photos.map((src, idx) => (
            <div
              key={src}
              className="thumb reveal"
              style={{ animationDelay: `${idx * 60}ms` }}
              onClick={() => openAt(idx)}
              role="button"
              aria-label={`Open photo ${idx + 1}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openAt(idx)}
            >
              <img src={src} alt={`Rikta ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <Link to="/" className="btn btn-ghost">← Back Home</Link>
        </div>
      </div>

      {/* Lightbox modal */}
      {openIndex > -1 && (
        <div
          className="lb-overlay"
          data-lightbox="overlay"
          onClick={onOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div className="lb-frame" aria-live="polite">
            <button className="lb-close" onClick={closeModal} aria-label="Close viewer">✕</button>

            <button className="lb-nav lb-prev" onClick={prev} aria-label="Previous image">‹</button>

            <div className="lb-content">
              <img
                src={photos[openIndex]}
                alt={`Rikta ${openIndex + 1}`}
                className="lb-image"
                key={photos[openIndex]} // key to trigger transition
              />
              <div className="lb-caption"> {openIndex + 1} of {photos.length} </div>
            </div>

            <button className="lb-nav lb-next" onClick={next} aria-label="Next image">›</button>

            <div className="lb-actions">
              <button className="btn btn-glow" onClick={downloadCurrent} aria-label="Download current photo">Download</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

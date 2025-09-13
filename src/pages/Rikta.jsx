// src/pages/Rikta.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi"; // 👈 Import download icon

export default function Rikta() {
  const [photos, setPhotos] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    const list = Array.from({ length: 34 }, (_, i) => `/g${i + 1}.jpg`);
    list[26] = "/g27(1).jpeg";
    list[31] = "/g32(1).jpeg";
    list.push("/g35.jpeg", "/g36.jpeg");
    setPhotos(list);
  }, []);

  const closeModal = useCallback(() => {
    setOpenIndex(-1);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setOpenIndex((cur) => (cur <= 0 ? photos.length - 1 : cur - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setOpenIndex((cur) => (cur >= photos.length - 1 ? 0 : cur + 1));
  }, [photos.length]);

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

  function onOverlayClick(e) {
    if (e.target.dataset.lightbox === "overlay") closeModal();
  }

  function downloadCurrent() {
    if (openIndex < 0) return;
    const url = photos[openIndex];
    const a = document.createElement("a");
    a.href = url;
    a.download = `rikta-${openIndex + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="page">
      <div className="container">
        <h2>Rikta's Gallery</h2>
        <p className="muted">
          Click any photo to open the viewer — use arrow keys or buttons to
          navigate.
        </p>

        <div className="gallery-grid">
          {photos.map((src, idx) => (
            <div
              key={src}
              className="thumb reveal"
              style={{ animationDelay: `${idx * 40}ms` }}
              onClick={() => {
                setOpenIndex(idx);
                document.body.style.overflow = "hidden";
              }}
              role="button"
              aria-label={`Open photo ${idx + 1}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setOpenIndex(idx)}
            >
              <img src={src} alt={`Rikta ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <Link to="/" className="btn btn-ghost">
            ← Back Home
          </Link>
        </div>
      </div>

      {openIndex > -1 && (
        <div
          className="lb-overlay"
          data-lightbox="overlay"
          onClick={onOverlayClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="lb-frame">
            <button className="lb-close" onClick={closeModal}>
              ✕
            </button>

            <button className="lb-nav lb-prev" onClick={prev}>
              ‹
            </button>

            <div className="lb-content">
              <img
                src={photos[openIndex]}
                alt={`Rikta ${openIndex + 1}`}
                className="lb-image"
                key={photos[openIndex]}
              />
              <div className="lb-caption">
                {openIndex + 1} of {photos.length}
              </div>
            </div>

            <button className="lb-nav lb-next" onClick={next}>
              ›
            </button>

            <div className="lb-actions">
              <button className="btn btn-glow" onClick={downloadCurrent}>
                <FiDownload size={22} /> {/* 👈 download icon */}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// src/pages/Rikta.jsx
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { FiDownload } from "react-icons/fi";

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

  function openAt(i) {
    setOpenIndex(i);
    document.body.style.overflow = "hidden";
  }

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
    <div>
      <Navbar mode="subpage" />

      <section className="page gallery-page">
        <div className="container">
          <h2>Rikta's Photos</h2>
          <p className="muted">Click any photo to open the viewer — use arrow keys or buttons to navigate.</p>

          <div className="gallery-grid">
            {photos.map((src, idx) => (
              <div
                key={src}
                className="thumb reveal"
                style={{ animationDelay: `${idx * 40}ms` }}
                onClick={() => openAt(idx)}
                role="button"
                aria-label={`Open photo ${idx + 1}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openAt(idx)}
              >
                <img src={src} alt={`Rikta ${idx + 1}`} loading="lazy" onError={(e)=>{e.currentTarget.style.visibility='hidden'}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {openIndex > -1 && (
        <div
          className="lb-overlay"
          data-lightbox="overlay"
          onClick={onOverlayClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="lb-frame">
            <button className="lb-close" onClick={closeModal} aria-label="Close viewer">✕</button>

            <button className="lb-nav lb-prev" onClick={prev} aria-label="Previous image">‹</button>

            <div className="lb-content">
              <img
                src={photos[openIndex]}
                alt={`Rikta ${openIndex + 1}`}
                className="lb-image"
                key={photos[openIndex]}
                onError={(e) => { e.currentTarget.style.opacity = '0.12'; }}
              />
              <div className="lb-caption">{openIndex + 1} of {photos.length}</div>
            </div>

            <button className="lb-nav lb-next" onClick={next} aria-label="Next image">›</button>

            <div className="lb-actions" aria-hidden>
              <button className="icon-btn" onClick={downloadCurrent} title="Download">
                <FiDownload size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

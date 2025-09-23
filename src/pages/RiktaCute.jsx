// src/pages/RiktaCute.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./RiktaCute.css";

export default function RiktaCute() {
  const folder = "/R4"; // public/R4
  const basename = "a";
  const maxToCheck = 197;
  const exts = [".jpg", ".jpeg", ".png", ".webp"];

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);

  const exists = async (url) => {
    try { const res = await fetch(url, { method: "HEAD" }); return res.ok; }
    catch { return false; }
  };
  const candidateUrlsForIndex = (i) => exts.map((ext) => `${folder}/${basename}${i}${ext}`);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = [];
      let consecutiveMisses = 0;
      for (let i = 1; i <= maxToCheck; i++) {
        if (cancelled) return;
        let okUrl = null;
        for (const url of candidateUrlsForIndex(i)) {
          // eslint-disable-next-line no-await-in-loop
          if (await exists(url)) { okUrl = url; break; }
        }
        if (okUrl) { found.push(okUrl); consecutiveMisses = 0; }
        else { consecutiveMisses++; }
        if (consecutiveMisses >= 8) break;
      }
      if (!cancelled) { setImages(found); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const openAt = useCallback((i) => setCurrent(i), []);
  const closeViewer = useCallback(() => setCurrent(null), []);
  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)), [images.length]);

  useEffect(() => {
    if (current === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, closeViewer, prev, next]);

  const downloadCurrent = useCallback(() => {
    if (current === null) return;
    const url = images[current];
    const a = document.createElement("a");
    a.href = url;
    a.download = `cute-${current + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a); a.click(); a.remove();
  }, [current, images]);

  return (
    <main className="cute-root">
      <header className="cute-topbar">
        <div className="cute-left">
          <div className="cute-logo">💖</div>
          <span className="cute-brand">Rikta</span>
        </div>
        <div className="cute-right">
          <button className="cute-btn" onClick={() => window.history.back()}>Back</button>
          <button className="cute-btn" onClick={() => console.log("Logout")}>Logout</button>
        </div>
      </header>

      <div className="cute-header">
        <div className="cute-title">Rikta's Cute Pics</div>
      </div>

      {loading ? (
        <div className="cute-loading">Looking for photos in {folder} ...</div>
      ) : images.length === 0 ? (
        <div className="cute-no">No photos found in {folder}</div>
      ) : (
        <div className="cute-grid">
          {images.map((src, i) => (
            <div key={src} className="cute-thumb">
              <button className="cute-thumb-btn" onClick={() => openAt(i)}>
                <img src={src} alt={`Cute ${i + 1}`} loading="lazy" />
              </button>
            </div>
          ))}
        </div>
      )}

      {current !== null && (
        <div className="cute-lightbox">
          <div className="cute-overlay" onClick={closeViewer} />
          <div className="cute-lightbox-inner">
            <div className="cute-controls-top">
              <button className="cute-close" onClick={closeViewer}>✕</button>
              <button className="cute-download" onClick={downloadCurrent}>⬇</button>
            </div>
            <button className="cute-arrow left" onClick={prev}>‹</button>
            <div className="cute-image-wrap">
              <img src={images[current]} alt="" className="cute-large" />
              <div className="cute-counter">{current + 1} of {images.length}</div>
            </div>
            <button className="cute-arrow right" onClick={next}>›</button>
          </div>
        </div>
      )}
    </main>
  );
}

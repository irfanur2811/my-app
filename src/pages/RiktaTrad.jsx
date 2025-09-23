// src/pages/RiktaTrad.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./RiktaTrad.css";

export default function RiktaTrad() {
  const folder = "/R3"; // public/R3
  const basename = "a";
  const maxToCheck = 30;
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
    a.download = `trad-${current + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a); a.click(); a.remove();
  }, [current, images]);

  return (
    <main className="trad-root">
      <header className="trad-topbar">
        <div className="trad-left">
          <div className="trad-logo">💖</div>
          <span className="trad-brand">Rikta</span>
        </div>
        <div className="trad-right">
          <button className="trad-btn" onClick={() => window.history.back()}>Back</button>
          <button className="trad-btn" onClick={() => console.log("Logout")}>Logout</button>
        </div>
      </header>

      <div className="trad-header">
        <div className="trad-title">Rikta's Traditional Looks</div>
        
      </div>

      {loading ? (
        <div className="trad-loading">Looking for photos in {folder} ...</div>
      ) : images.length === 0 ? (
        <div className="trad-no">No photos found in {folder}</div>
      ) : (
        <div className="trad-grid">
          {images.map((src, i) => (
            <div key={src} className="trad-thumb">
              <button className="trad-thumb-btn" onClick={() => openAt(i)}>
                <img src={src} alt={`Trad ${i + 1}`} loading="lazy" />
              </button>
            </div>
          ))}
        </div>
      )}

      {current !== null && (
        <div className="trad-lightbox">
          <div className="trad-overlay" onClick={closeViewer} />
          <div className="trad-lightbox-inner">
            <div className="trad-controls-top">
              <button className="trad-close" onClick={closeViewer}>✕</button>
              <button className="trad-download" onClick={downloadCurrent}>⬇</button>
            </div>
            <button className="trad-arrow left" onClick={prev}>‹</button>
            <div className="trad-image-wrap">
              <img src={images[current]} alt="" className="trad-large" />
              <div className="trad-counter">{current + 1} of {images.length}</div>
            </div>
            <button className="trad-arrow right" onClick={next}>›</button>
          </div>
        </div>
      )}
    </main>
  );
}

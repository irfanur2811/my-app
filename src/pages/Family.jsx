// src/pages/Family.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Family.css";

export default function Family() {
  // Config for Family gallery
  const folder = "/R2"; // public/R2
  const basename = "a"; // produces a1.jpg, a2.jpg, ...
  const maxToCheck = 46;
  const exts = [".jpg", ".jpeg", ".png", ".webp"];

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);

  // helper: check whether url exists
  const exists = async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  };

  const candidateUrlsForIndex = (i) =>
    exts.map((ext) => `${folder}/${basename}${i}${ext}`);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = [];
      let consecutiveMisses = 0;
      const maxConsecutiveMissesBeforeStop = 8;

      for (let i = 1; i <= maxToCheck; i++) {
        if (cancelled) return;
        const candidates = candidateUrlsForIndex(i);
        let foundThisIndex = null;
        for (const url of candidates) {
          // eslint-disable-next-line no-await-in-loop
          const ok = await exists(url);
          if (ok) {
            foundThisIndex = url;
            break;
          }
        }
        if (foundThisIndex) {
          found.push(foundThisIndex);
          consecutiveMisses = 0;
        } else {
          consecutiveMisses++;
        }
        if (consecutiveMisses >= maxConsecutiveMissesBeforeStop) break;
      }

      if (!cancelled) {
        setImages(found);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // lightbox handlers
  const openAt = useCallback((i) => setCurrent(i), []);
  const closeViewer = useCallback(() => setCurrent(null), []);
  const prev = useCallback(
    () => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)),
    [images.length]
  );

  // keyboard nav
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
    a.download = `family-${current + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [current, images]);

  return (
    <div className="family-root">
      {/* Gradient Header — same as Rikta */}
      <header className="family-topbar">
        <div className="family-left">
          <div className="family-logo" aria-hidden="true">💖</div>
          <span className="family-brand">Rikta</span>
        </div>
        <div className="family-right">
          <button className="family-btn" type="button" onClick={() => window.history.back()}>
            Back
          </button>
          <button className="family-btn" type="button" onClick={() => console.log("Logout clicked")}>
            Logout
          </button>
        </div>
      </header>

      {/* Page header */}
      <main>
        <div className="family-header">
          <div className="family-title">Family Photos</div>

        </div>

        {loading ? (
          <div className="family-loading">Looking for photos in <strong>{folder}</strong> ...</div>
        ) : images.length === 0 ? (
          <div className="family-no">
            No photos found in <code>{folder}</code>. Put images like <code>{basename}1.jpg</code> etc.
          </div>
        ) : (
          <div className="family-grid" role="list">
            {images.map((src, i) => (
              <div key={src} className="family-thumb" role="listitem">
                <button
                  className="family-thumb-btn"
                  onClick={() => openAt(i)}
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img src={src} alt={`Family ${i + 1}`} loading="lazy" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {current !== null && (
          <div className="family-lightbox" role="dialog" aria-modal="true">
            <div className="family-overlay" onClick={closeViewer} />

            <div className="family-lightbox-inner">
              <div className="family-controls-top">
                <button className="family-close" onClick={closeViewer} aria-label="Close">✕</button>
                <button className="family-download" onClick={downloadCurrent} aria-label="Download">⬇</button>
              </div>

              <button className="family-arrow left" onClick={prev} aria-label="Previous image">‹</button>

              <div className="family-image-wrap" onClick={(e) => e.stopPropagation()}>
                <img src={images[current]} alt={`Open ${current + 1}`} className="family-large" />
                <div className="family-counter">{current + 1} of {images.length}</div>
              </div>

              <button className="family-arrow right" onClick={next} aria-label="Next image">›</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

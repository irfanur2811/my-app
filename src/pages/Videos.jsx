// src/pages/Videos.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Videos.css";

export default function Videos() {
  // configuration
  const folder = "/R5";             // public/R5
  const basename = "a";             // a1.mp4, a2.mp4 ...
  const exts = [".mp4", ".webm", ".ogg"];
  const maxToCheck = 14;
  const concurrency = 8;            // number of parallel workers
  const probeTimeout = 3000;        // ms per probe

  const [videos, setVideos] = useState([]);    // discovered video URLs
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null); // index in videos or null
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome", { replace: true });
  }
  function handleBack() { navigate(-1); }

  // build candidate urls for index i
  const candidateUrlsForIndex = (i) =>
    exts.map((ext) => `${folder}/${basename}${i}${ext}`);

  // probe a single video url by waiting for loadedmetadata (fast) or timing out
  const probeVideo = (url, timeout = probeTimeout) =>
    new Promise((resolve) => {
      try {
        const v = document.createElement("video");
        let done = false;
        const onLoad = () => { if (done) return; done = true; cleanup(); resolve({ ok: true, url }); };
        const onErr  = () => { if (done) return; done = true; cleanup(); resolve({ ok: false, url }); };
        const cleanup = () => { v.onloadedmetadata = null; v.onerror = null; clearTimeout(timer); };
        v.onloadedmetadata = onLoad;
        v.onerror = onErr;
        v.muted = true; v.playsInline = true;
        v.preload = "metadata";
        v.src = url;
        if (v.readyState >= 1) { onLoad(); return; }
        const timer = setTimeout(() => { if (done) return; done = true; cleanup(); resolve({ ok: false, url, timeout: true }); }, timeout);
      } catch (e) {
        resolve({ ok: false, url });
      }
    });

  // probe indices in parallel with workers
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const indexCandidates = [];
      for (let i = 1; i <= maxToCheck; i++) indexCandidates.push({ index: i, candidates: candidateUrlsForIndex(i) });

      let idx = 0;
      const foundByIndex = {};

      const worker = async () => {
        while (true) {
          if (cancelled) return;
          const local = idx++;
          if (local >= indexCandidates.length) return;
          const { index, candidates } = indexCandidates[local];
          let foundThis = null;
          for (const url of candidates) {
            if (cancelled) return;
            // eslint-disable-next-line no-await-in-loop
            const r = await probeVideo(url);
            if (r.ok) { foundThis = url; break; }
          }
          foundByIndex[index] = foundThis || null;
        }
      };

      await Promise.all(new Array(concurrency).fill(null).map(() => worker()));

      // collect in order and stop on several misses
      const collected = [];
      const maxConsecutiveMisses = 8;
      let misses = 0;
      for (let i = 1; i <= maxToCheck; i++) {
        if (cancelled) return;
        const url = foundByIndex[i] || null;
        if (url) { collected.push(url); misses = 0; } else { misses++; }
        if (misses >= maxConsecutiveMisses) break;
      }

      if (!cancelled) {
        setVideos(collected);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []); // run once

  // lightbox handlers
  const openAt = useCallback((i) => setCurrent(i), []);
  const closeViewer = useCallback(() => setCurrent(null), []);
  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : videos.length - 1)), [videos.length]);
  const next = useCallback(() => setCurrent((c) => (c < videos.length - 1 ? c + 1 : 0)), [videos.length]);

  // keyboard nav for viewer
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

  // download current video
  const downloadCurrent = useCallback(() => {
    if (current === null) return;
    const url = videos[current];
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-${current + 1}${url.substring(url.lastIndexOf("."))}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [current, videos]);

  return (
    <main className="videos-root">
      <header className="videos-header">
        <div className="vh-left">
          <span className="vh-logo">💖</span>
          <div className="vh-title">Rikta's Videos</div>
        </div>
        <div className="vh-right">
          <button className="vh-btn vh-back" onClick={handleBack}>Back</button>
          <button className="vh-btn vh-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="videos-main container">
        <h1 className="videos-h1">Videos</h1>

        {loading ? (
          <div className="videos-loading">Looking for videos in <strong>{folder}</strong> ...</div>
        ) : videos.length === 0 ? (
          <div className="videos-no">No videos found in <code>{folder}</code>. Put files like <code>{basename}1.mp4</code>.</div>
        ) : (
          <div className="videos-grid" role="list" aria-live="polite">
            {videos.map((src, i) => (
              <div key={src} className="video-thumb" role="listitem">
                <button className="video-thumb-btn" onClick={() => openAt(i)} aria-label={`Open video ${i+1}`}>
                  {/* preview video element no controls — acts as poster/cropped preview */}
                  <video src={src} preload="metadata" muted playsInline className="video-preview" />
                  {/* custom circular play button (white circle + triangle) */}
                  <div className="custom-play" aria-hidden>
                    <svg viewBox="0 0 100 100" className="custom-play-svg" role="img" aria-hidden>
                      <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35"/>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="36" className="cp-circle" filter="url(#shadow)"/>
                      <polygon points="42,34 42,66 72,50" className="cp-triangle"/>
                    </svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox / viewer */}
      {current !== null && (
        <div className="videos-lightbox" role="dialog" aria-modal="true">
          <div className="vl-overlay" onClick={closeViewer} />

          <div className="vl-inner" onClick={(e) => e.stopPropagation()}>
            <div className="vl-top-controls">
              <button className="vl-close" onClick={closeViewer} aria-label="Close">✕</button>
              <button className="vl-download vl-download-colored" onClick={downloadCurrent} aria-label="Download">⬇</button>
            </div>

            <button className="vl-arrow left" onClick={prev} aria-label="Previous">‹</button>

            <div className="vl-video-wrap">
              <video
                src={videos[current]}
                controls
                autoPlay
                playsInline
                className="vl-video"
              />
              <div className="vl-counter">{current + 1} of {videos.length}</div>
            </div>

            <button className="vl-arrow right" onClick={next} aria-label="Next">›</button>
          </div>
        </div>
      )}
    </main>
  );
}

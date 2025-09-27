// src/pages/Videos.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Videos.css";

/**
 * Videos page — manifest-first (fast + reliable) with a robust fallback probe.
 * Fixes:
 *  - keyboard handling (ArrowLeft/Right/Escape + keyCode)
 *  - ensure control buttons are clickable (type="button", pointer-events)
 *  - safer fallback probing that won't prematurely stop and collects all found files
 */

export default function Videos() {
  const folder = "/R5";
  const basename = "a";
  const exts = [".mp4", ".webm", ".ogg"];
  const maxToCheck = 80; // check up to aN (increase to be safe)
  const probeTimeout = 3000;
  const concurrency = 8;

  const [videos, setVideos] = useState([]); // array of urls
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);

  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome", { replace: true });
  }
  function handleBack() { navigate(-1); }

  // ---------- util probes ----------
  const probeVideo = (url, timeout = probeTimeout) =>
    new Promise((resolve) => {
      try {
        const vid = document.createElement("video");
        let done = false;
        const onLoad = () => {
          if (done) return;
          done = true;
          cleanup();
          resolve({ ok: true, url });
        };
        const onErr = () => {
          if (done) return;
          done = true;
          cleanup();
          resolve({ ok: false, url });
        };
        const cleanup = () => {
          vid.onloadedmetadata = null;
          vid.onerror = null;
          clearTimeout(timer);
        };
        vid.onloadedmetadata = onLoad;
        vid.onerror = onErr;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = "metadata";
        vid.src = url;
        if (vid.readyState >= 1) { onLoad(); return; }
        const timer = setTimeout(() => {
          if (done) return;
          done = true;
          cleanup();
          resolve({ ok: false, url, timeout: true });
        }, timeout);
      } catch (e) {
        resolve({ ok: false, url });
      }
    });

  // parallel worker probe across indices (collects whatever exists; does not stop early)
  const parallelProbeAll = async () => {
    const candidatesByIndex = [];
    for (let i = 1; i <= maxToCheck; i++) {
      candidatesByIndex.push({ i, urls: exts.map(ext => `${folder}/${basename}${i}${ext}`) });
    }

    let idx = 0;
    const foundMap = {}; // index -> url

    const worker = async () => {
      while (true) {
        const local = idx++;
        if (local >= candidatesByIndex.length) return;
        const { i, urls } = candidatesByIndex[local];
        for (const url of urls) {
          // eslint-disable-next-line no-await-in-loop
          const res = await probeVideo(url);
          if (res.ok) { foundMap[i] = res.url; break; }
        }
      }
    };

    await Promise.all(new Array(concurrency).fill(null).map(() => worker()));

    // collect in numeric order; include only those found
    const collected = [];
    for (let i = 1; i <= maxToCheck; i++) {
      if (foundMap[i]) collected.push(foundMap[i]);
    }
    return collected;
  };

  // ---------- manifest-first loader ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // try to fetch manifest first
      try {
        const resp = await fetch(`${folder}/index.json`, { cache: "no-cache" });
        if (resp.ok) {
          const json = await resp.json();
          const mapped = (json.files || json).map((f) => {
            // support either string entries or { full: 'a1.mp4' }
            const filename = typeof f === "string" ? f : (f.full || f);
            return `${json.base || folder}/${filename}`;
          });
          if (!cancelled) {
            setVideos(mapped);
            setLoading(false);
            console.log("[Videos] loaded from manifest:", mapped.length, "items");
            return;
          }
        } else {
          console.debug("[Videos] manifest not found or not OK:", resp.status);
        }
      } catch (err) {
        console.debug("[Videos] failed to fetch manifest:", err && err.message);
      }

      // fallback: parallel probe for existing files (safer version)
      console.log("[Videos] manifest missing -> probing up to", maxToCheck);
      const found = await parallelProbeAll();
      if (!cancelled) {
        setVideos(found);
        setLoading(false);
        console.log("[Videos] probe found:", found.length, "items");
      }
    })();

    return () => { cancelled = true; };
  }, []); // run once on mount

  // ---------- viewer handlers ----------
  const openAt = useCallback((i) => setCurrent(i), []);
  const closeViewer = useCallback(() => setCurrent(null), []);
  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : (videos.length ? videos.length - 1 : null))), [videos.length]);
  const next = useCallback(() => setCurrent((c) => (c < videos.length - 1 ? c + 1 : 0)), [videos.length]);

  // keyboard nav — robust: support key and keyCode
  useEffect(() => {
    if (current === null) return;
    const onKey = (e) => {
      const k = e.key;
      const code = e.keyCode;
      if (k === "Escape" || code === 27) closeViewer();
      if (k === "ArrowLeft" || code === 37) prev();
      if (k === "ArrowRight" || code === 39) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, closeViewer, prev, next]);

  // download
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

  // debug logs for quick checking
  useEffect(() => {
    console.log("[Videos] state - loading:", loading, "videos:", videos.length);
  }, [loading, videos.length]);

  return (
    <main className="videos-root">
      <header className="videos-header">
        <div className="vh-left">
          <span className="vh-logo">💖</span>
          <div className="vh-title">Rikta</div>
        </div>
        <div className="vh-right">
          <button type="button" className="vh-btn vh-back" onClick={handleBack}>Back</button>
          <button type="button" className="vh-btn vh-logout" onClick={handleLogout}>Logout</button>
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
                <button type="button" className="video-thumb-btn" onClick={() => openAt(i)} aria-label={`Open video ${i+1}`}>
                  <video src={src} preload="metadata" muted playsInline className="video-preview" />
                  <div className="video-overlay">
                    <div className="play-icon">►</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {current !== null && (
        <div className="videos-lightbox" role="dialog" aria-modal="true">
          <div className="vl-overlay" onClick={closeViewer} />

          <div className="vl-inner" onClick={(e) => e.stopPropagation()}>
            <div className="vl-top-controls">
              {/* ensure type="button" so they don't try to submit anything */}
              <button type="button" className="vl-close" onClick={closeViewer} aria-label="Close">✕</button>
              <button type="button" className="vl-download vl-download-colored" onClick={downloadCurrent} aria-label="Download">⬇</button>
            </div>

            <button type="button" className="vl-arrow left" onClick={prev} aria-label="Previous">‹</button>

            <div className="vl-video-wrap">
              <video src={videos[current]} controls autoPlay playsInline className="vl-video" />
              <div className="vl-counter">{current + 1} of {videos.length}</div>
            </div>

            <button type="button" className="vl-arrow right" onClick={next} aria-label="Next">›</button>
          </div>
        </div>
      )}
    </main>
  );
}

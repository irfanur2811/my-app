// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Home.css";

function Countdown({ targetDateIso }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    function calc() {
      const now = new Date();
      const target = new Date(targetDateIso);
      if (target < now) target.setFullYear(now.getFullYear() + 1);
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setLeft({ days, hours, mins });
    }
    calc();
    const t = setInterval(calc, 60 * 1000);
    return () => clearInterval(t);
  }, [targetDateIso]);

  if (!left) return null;
  return (
    <div className="countdown" aria-hidden>
      <div className="count-item animate-pop">
        <strong>{left.days}</strong><span>days</span>
      </div>
      <div className="count-item animate-pop" style={{ animationDelay: ".08s" }}>
        <strong>{left.hours}</strong><span>hrs</span>
      </div>
      <div className="count-item animate-pop" style={{ animationDelay: ".16s" }}>
        <strong>{left.mins}</strong><span>mins</span>
      </div>
    </div>
  );
}

export default function Home() {
  const coupleName = "This is Sayan and Rikta's Personal Space";
  const anniversaryISO = "2025-12-31T00:00:00";
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  // Lightbox state and image list
  const peopleImages = ["/boy.jpeg", "/girl.jpeg"];
  const [current, setCurrent] = useState(null); // null or index

  useEffect(() => {
    const sample = [
      { id: "m1", title: "Moonlight walk", date: "2025-08-20", snippet: "A beautiful walk by the river." },
      { id: "m2", title: "Home-cooked dinner", date: "2025-07-10", snippet: "Tried that new pasta recipe." },
      { id: "m3", title: "Cinema night", date: "2025-06-02", snippet: "Laughs and popcorn." },
    ];
    const t = setTimeout(() => setMemories(sample), 180);
    return () => clearTimeout(t);
  }, []);

  // lightbox controls
  const openAt = useCallback((i) => setCurrent(i), []);
  const closeViewer = useCallback(() => setCurrent(null), []);
  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : peopleImages.length - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c < peopleImages.length - 1 ? c + 1 : 0)), []);

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

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome", { replace: true });
  }

  return (
    <section className="page home">
      {/* Header (non-fixed) */}
      <header className="rc-header">
        <div className="rc-left">
          <span className="rc-logo-emoji">💖</span>
          <div className="rc-title">Sayan &amp; Rikta</div>
        </div>
        <div className="rc-right">
          <button className="rc-btn rc-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="floating-shapes" aria-hidden>
        <span className="shape s1" />
        <span className="shape s2" />
        <span className="shape s3" />
        <span className="shape s4" />
        <span className="shape heart">♥</span>
      </div>

      <div className="hero hero-couple">
        <div className="container hero-inner">
          <div className="hero-left">
            <div className="badge">Private Space</div>
            <h1 className="hero-title">{coupleName}</h1>
            <p className="lead">A cozy corner for memories, photos and tiny notes — just for the two of you.</p>

            <div className="cta-row">
              <Link to="/rikta-collection" className="btn btn-glow">Gallery</Link>
              <Link to="/patients" className="btn btn-ghost">Timeline</Link>
              <Link to="/contact" className="btn btn-ghost">Contact</Link>
            </div>

            <div className="small-note">Tip: click <strong>Gallery</strong> to add photos (we'll wire uploads later).</div>
          </div>

          <div className="hero-right card-glass">
            <h4>Next anniversary</h4>
            <Countdown targetDateIso={anniversaryISO} />
            <div className="muted small">Edit the date in <code>src/pages/Home.jsx</code></div>
          </div>
        </div>

        {/* CENTERED COUPLE PHOTOS (clickable) */}
        <div className="container couple-center">
          <div className="couple-row">
            <div className="person-card" role="group" aria-label="Sayan">
              <div className="person-photo-wrap" onClick={() => openAt(0)} style={{ cursor: "zoom-in" }}>
                <img src={peopleImages[0]} alt="Sayan" className="person-photo" />
              </div>
              <div className="person-info">
                <div className="person-name">Sayan</div>
                <div className="person-sub">The Handsome Munda</div>
              </div>
            </div>

            <div className="person-card" role="group" aria-label="Rikta">
              <div className="person-photo-wrap" onClick={() => openAt(1)} style={{ cursor: "zoom-in" }}>
                <img src={peopleImages[1]} alt="Rikta" className="person-photo" />
              </div>
              <div className="person-info">
                <div className="person-name">Rikta</div>
                <div className="person-sub">The Sohneya Gudi</div>
              </div>
            </div>
          </div>
        </div>

        {/* WANT TO SEE MORE */}
        <div className="container want-more">
          <h3 className="want-more-title">Want to see more of:</h3>
          <div className="compact-column" role="tablist" aria-label="Choose person">
            <NavLink
              to="/rikta-collection"
              className={({ isActive }) => `compact-pill compact-rikta floating ${isActive ? "compact-active" : ""}`}
            >
              Rikta
            </NavLink>
            <NavLink
              to="/irfan"
              className={({ isActive }) => `compact-pill compact-irfan floating ${isActive ? "compact-active" : ""}`}
            >
              Sayan
            </NavLink>
          </div>
        </div>
      </div>

      <div className="container memories-section">
        <h2>Recent memories</h2>
        {memories.length === 0 ? (
          <p>No memories yet — start adding some beautiful moments.</p>
        ) : (
          <div className="grid memory-grid">
            {memories.map((m, idx) => (
              <article key={m.id} className="memory-card reveal" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="memory-image" aria-hidden />
                <div className="memory-body">
                  <h4>{m.title}</h4>
                  <div className="muted small">{m.date}</div>
                  <p>{m.snippet}</p>
                  <div style={{ marginTop: 8 }}>
                    <Link to="/patients" className="btn btn-sm">View</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX / POPUP */}
      {current !== null && (
        <div className="home-lightbox" role="dialog" aria-modal="true">
          <div className="hl-overlay" onClick={closeViewer} />
          <div className="hl-inner" onClick={(e) => e.stopPropagation()}>
            <div className="hl-controls-top">
              <button className="hl-close" onClick={closeViewer} aria-label="Close">✕</button>
            </div>

            <button className="hl-arrow left" onClick={prev} aria-label="Previous image">‹</button>

            <div className="hl-image-wrap">
              <img src={peopleImages[current]} alt={`Person ${current + 1}`} className="hl-large" />
              <div className="hl-counter">{current + 1} of {peopleImages.length}</div>
            </div>

            <button className="hl-arrow right" onClick={next} aria-label="Next image">›</button>
          </div>
        </div>
      )}
    </section>
  );
}

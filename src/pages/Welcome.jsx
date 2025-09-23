// src/pages/Welcome.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const [bursts, setBursts] = useState([]); // active heart particles
  const containerRef = useRef(null);
  const heartBtnRef = useRef(null);
  const navigate = useNavigate?.() ?? (() => {}); // safe if react-router not used

  useEffect(() => {
    // cleanup on unmount
    return () => setBursts([]);
  }, []);

  function handleHeartClick() {
    const container = containerRef.current;
    const btn = heartBtnRef.current;
    if (!container || !btn) return;

    const rect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // start position = center of heart button relative to container
    const startX = Math.round(btnRect.left - rect.left + btnRect.width / 2);
    const startY = Math.round(btnRect.top - rect.top + btnRect.height / 2);

    const COUNT = 16;
    const newOnes = Array.from({ length: COUNT }).map((_, i) => {
      const tx = Math.round((Math.random() - 0.5) * 320);         // horizontal travel px
      const ty = Math.round(-120 - Math.random() * 360);         // upward travel px (negative)
      const rot = Math.round((Math.random() - 0.5) * 80);        // rotation deg
      const delay = Math.round(Math.random() * 220);             // stagger start
      const scale = (Math.random() * 0.9 + 0.6).toFixed(2);      // scale factor
      const colors = ["#ff6b6b", "#ff9aa2", "#ff7a59", "#ffb86b", "#ff6fb2", "#d57bff", "#ff9de2"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: `${Date.now()}_${i}_${Math.random().toString(36).slice(2,8)}`,
        left: startX,
        top: startY,
        tx,
        ty,
        rot,
        delay,
        scale,
        color
      };
    });

    setBursts(prev => [...prev, ...newOnes]);

    // remove these after ~3.2s
    setTimeout(() => {
      setBursts(prev => prev.filter(b => !newOnes.some(n => n.id === b.id)));
    }, 3200);
  }

  return (
    <section
      className="welcome-hero"
      role="banner"
      aria-label="Welcome hero"
      ref={containerRef}
    >
      {/* rendered hearts */}
      {bursts.map(b => (
        <span
          key={b.id}
          className="burst-heart"
          style={{
            left: `${b.left}px`,
            top: `${b.top}px`,
            // CSS vars read by CSS animation
            ["--bx"]: `${b.tx}px`,
            ["--by"]: `${b.ty}px`,
            ["--rot"]: `${b.rot}deg`,
            ["--burst-delay"]: `${b.delay}ms`,
            ["--burst-scale"]: b.scale,
            ["--burst-color"]: b.color
          }}
          aria-hidden="true"
        />
      ))}

      {/* Top-right heart button */}
      <div className="top-actions">
        <button
          ref={heartBtnRef}
          className="heart-btn"
          aria-label="Celebrate"
          title="Celebrate"
          onClick={handleHeartClick}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12.1 21s-7.4-4.3-9.6-6.7C-0.7 10.7 4.4 5 8.6 7.1 10.6 8 12 10 12 10s1.4-2 3.4-2.9C19.6 5 24.7 10.7 21.5 14.3 19.3 16.7 12.1 21 12.1 21z" fill="white"/>
          </svg>
        </button>
      </div>

      {/* Left content */}
      <div className="hero-content">
        <img src="/assets/logo.jpeg" alt="Sayan and Rikta Logo" className="site-logo" />
        <div className="logo-text">
          <div className="brand">SAYAN AND RIKTA</div>
          <div className="slogan">THE JOURNEY OF 2 LOVERS</div>
        </div>

        <h1 className="hero-title">
          Welcome to
          <br />
          <span className="highlight">Our Site</span>
        </h1>

        <p className="hero-subtitle">
          Discover our journey, memories, and the private world we’ve built together.
        </p>

        <div className="cta-row">
          <button
            className="cta-btn"
            onClick={() => {
              // use navigate if available; fallback to location change
              try { navigate("/login"); } catch (err) { window.location.href = "/login"; }
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Right artwork (half-screen) */}
      <div className="hero-art" role="img" aria-label="Abstract artwork">
        <div className="grain" />
      </div>
    </section>
  );
}

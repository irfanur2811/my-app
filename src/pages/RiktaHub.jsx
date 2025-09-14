// src/pages/RiktaHub.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RiktaHub() {
  const nav = useNavigate();

  const cards = [
    {
      id: "photos",
      title: "Rikta's Photos",
      desc: "All photos — view the full gallery",
      colorClass: "hub-pink",
      to: "/rikta/photos",
      emoji: "📸",
    },
    {
      id: "videos",
      title: "Rikta's Videos",
      desc: "Short clips & favorite moments",
      colorClass: "hub-purple",
      to: "/rikta/videos",
      emoji: "🎬",
    },
    {
      id: "family",
      title: "Rikta's Family Photos",
      desc: "Family memories & portraits",
      colorClass: "hub-teal",
      to: "/rikta/family",
      emoji: "👨‍👩‍👧‍👦",
    },
  ];

  return (
    <div className="rikta-hub-page">
      <Navbar mode="hub" />

      <main className="page container">
        <div className="hub-intro" style={{ textAlign: "center", marginTop: 28 }}>
          <h1 style={{ margin: 0 }}>Rikta — Collections</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Choose a collection to explore. Click a card to open.
          </p>
        </div>

        <div className="hub-grid" role="list" style={{ marginTop: 28 }}>
          {cards.map((c, i) => (
            <button
              key={c.id}
              className={`hub-card ${c.colorClass}`}
              onClick={() => nav(c.to)}
              role="listitem"
              aria-label={c.title}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="hub-card-inner">
                <div className="hub-emoji" aria-hidden>
                  {c.emoji}
                </div>
                <h3 className="hub-title">{c.title}</h3>
                <p className="hub-desc">{c.desc}</p>
                <div className="hub-cta">Open →</div>
              </div>

              {/* decorative shapes */}
              <span className="hub-bubble hub-bubble-1" />
              <span className="hub-bubble hub-bubble-2" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

// src/pages/RiktaCollection.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RiktaCollection.css";

export default function RiktaCollection() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome", { replace: true });
  }

  return (
    <div className="collection-page">
      {/* Header bar */}
      <header className="rc-header">
        <div className="rc-left">
          <span className="rc-logo-emoji">💖</span>
          <div className="rc-title">Rikta</div>
        </div>

        <div className="rc-right">
          <button
            className="rc-btn rc-back"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            Back
          </button>
          <button
            className="rc-btn rc-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="rc-main container">
        {/* Page heading */}
        <div className="rc-pagehead">
          <h1 className="rc-h1">Rikta — Gallery</h1>
          <p className="rc-sub">
            Choose a collection to explore. Click a card to open.
          </p>
        </div>

        {/* Collection grid */}
        <section className="collection-grid" aria-label="Collections">
          {/* Photos */}
          <Link
            to="/rikta"
            className="collection-card card-photos"
            aria-label="Rikta's Photos"
          >
            <div className="card-inner">
              <div className="card-title">Rikta's Photos</div>
              <div className="card-sub">
                All photos — view the full gallery
              </div>
              <button className="card-open" type="button">Open →</button>
            </div>
          </Link>

          {/* Traditional Looks */}
          <Link
            to="/rikta/trad"
            className="collection-card card-trad"
            aria-label="Rikta's Traditional Looks"
          >
            <div className="card-inner">
              <div className="card-title">Rikta's Traditional Looks</div>
              <div className="card-sub">Explore traditional looks</div>
              <button className="card-open" type="button">Open →</button>
            </div>
          </Link>

          {/* Videos */}
          <Link
            to="/rikta/videos"
            className="collection-card card-videos"
            aria-label="Rikta's Videos"
          >
            <div className="card-inner">
              <div className="card-title">Rikta's Videos</div>
              <div className="card-sub">
                Short clips &amp; favorite moments
              </div>
              <button className="card-open" type="button">Open →</button>
            </div>
          </Link>

          {/* Cute Pics */}
          <Link
            to="/rikta/cute"
            className="collection-card card-cute"
            aria-label="Rikta's Cute Pics"
          >
            <div className="card-inner">
              <div className="card-title">Rikta's Cute Pics</div>
              <div className="card-sub">Sweet &amp; adorable photos</div>
              <button className="card-open" type="button">Open →</button>
            </div>
          </Link>

          {/* Family */}
          <Link
            to="/rikta/family"
            className="collection-card card-family"
            aria-label="Rikta's Family Photos"
          >
            <div className="card-inner">
              <div className="card-title">Rikta's Family & Friends</div>
              <div className="card-sub">
                Family memories &amp; portraits
              </div>
              <button className="card-open" type="button">Open →</button>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Navbar
 * - mode = "hub"    -> shows: Home
 * - mode = "subpage" -> shows: Home + Back
 *
 * Usage:
 * <Navbar mode="hub" />         // RiktaHub page
 * <Navbar mode="subpage" />     // Rikta photos/videos/family pages
 */
export default function Navbar({ mode = "hub" }) {
  return (
    <nav className="app-navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-left">💖 Sayan &amp; Rikta</div>

      <div className="nav-right">
        {/* Home always available (but we keep hub showing only Home for clarity) */}
        <Link to="/" className="nav-link">
          Home
        </Link>

        {/* On subpages also show Back */}
        {mode === "subpage" && (
          <Link to="/rikta" className="nav-link">
            Back
          </Link>
        )}
      </div>
    </nav>
  );
}

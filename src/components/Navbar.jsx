import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ mode = "hub" }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome");
  }

  return (
    <nav className="app-navbar">
      <div className="nav-left">💖 Sayan &amp; Rikta</div>

      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        {mode === "subpage" && (
          <Link to="/rikta" className="nav-link">Back</Link>
        )}
        {/* Always show logout if authenticated */}
        {localStorage.getItem("auth") === "true" && (
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

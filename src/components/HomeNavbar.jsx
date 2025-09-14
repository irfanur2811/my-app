// src/components/HomeNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeNavbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/welcome");
  }

  return (
    <nav className="app-navbar">
      <div className="nav-left">💖 Sayan &amp; Rikta</div>
      <div className="nav-right">
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

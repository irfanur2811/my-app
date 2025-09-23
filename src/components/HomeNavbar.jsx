import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeNavbar.css";

export default function HomeNavbar({ showBack, backTo }) {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("auth");
    navigate("/welcome");
  }
  return (
    <nav className="app-navbar">
      <div className="nav-left">💖 Sayan &amp; Rikta</div>
      <div className="nav-right">
        {showBack && <button className="nav-btn" onClick={() => navigate(backTo || "/")}>Back</button>}
        <button className="nav-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

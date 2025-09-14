import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <h1>Welcome to the world of Rikta and Sayan 💖</h1>
      <button className="welcome-btn" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
}

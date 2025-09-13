// src/pages/Irfan.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Irfan() {
  return (
    <div className="container page" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <h2>Irfan's Photos</h2>
      <p className="muted">Add photos for Irfan here. (You will upload images later.)</p>

      <div style={{ marginTop: 18 }}>
        <Link to="/" className="btn btn-ghost">← Back Home</Link>
      </div>
    </div>
  );
}

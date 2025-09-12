import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="page home">
      <div className="hero">
        <h1>Welcome to MySite</h1>
        <p>Starter template — routes, layout, mock data ready. Build your main site here.</p>
        <div style={{ marginTop: 18 }}>
          <Link to="/patients" className="btn">View Patients (Demo)</Link>
        </div>
      </div>

      <div className="features">
        <div className="card">
          <h3>Fast Iteration</h3>
          <p>Focus on UI, then plug backend later.</p>
        </div>
        <div className="card">
          <h3>Extensible</h3>
          <p>Routing, layout, env-ready for Supabase integration.</p>
        </div>
        <div className="card">
          <h3>Deployable</h3>
          <p>Deploy to Vercel — environment variables supported.</p>
        </div>
      </div>
    </section>
  );
}

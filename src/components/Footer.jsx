import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} MySite — built with React & Supabase-ready</p>
      </div>
    </footer>
  );
}

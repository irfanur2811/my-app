import React from 'react';
import { NavLink } from 'react-router-dom';

const active = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner container">
        <div className="brand">
          <a href="/" className="brand-link">MySite</a>
        </div>
        <nav className="nav">
          <NavLink to="/" className={active} end>Home</NavLink>
          <NavLink to="/about" className={active}>About</NavLink>
          <NavLink to="/patients" className={active}>Patients</NavLink>
          <NavLink to="/contact" className={active}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}

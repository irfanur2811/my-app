import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound(){
  return (
    <section style={{padding:40}}>
      <h2>404 — Not found</h2>
      <p>Oops. That page doesn't exist. <Link to="/">Go home</Link></p>
    </section>
  );
}

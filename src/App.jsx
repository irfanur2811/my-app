// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Patients from './pages/Patients';
import Contact from './pages/Contact';
import Rikta from './pages/Rikta';
import Irfan from './pages/Irfan';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="patients" element={<Patients />} />
        <Route path="contact" element={<Contact />} />
        <Route path="rikta" element={<Rikta />} />
        <Route path="irfan" element={<Irfan />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

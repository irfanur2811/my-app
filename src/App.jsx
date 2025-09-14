// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import Home from "./pages/Home";
import RiktaHub from "./pages/RiktaHub";
import Rikta from "./pages/Rikta";
import RiktaVideos from "./pages/RiktaVideos";
import RiktaFamily from "./pages/RiktaFamily";
import Irfan from "./pages/Irfan";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rikta" element={<RiktaHub />} />
        <Route path="/rikta/photos" element={<Rikta />} />
        <Route path="/rikta/videos" element={<RiktaVideos />} />
        <Route path="/rikta/family" element={<RiktaFamily />} />
        <Route path="/irfan" element={<Irfan />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

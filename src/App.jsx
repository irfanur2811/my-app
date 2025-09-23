// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RiktaCollection from "./pages/RiktaCollection";
import Rikta from "./pages/Rikta";
import Family from "./pages/Family";
import Videos from "./pages/Videos";
import RiktaTrad from "./pages/RiktaTrad";
import RiktaCute from "./pages/RiktaCute";

function RequireAuth({ children }) {
  const authed = !!localStorage.getItem("auth");
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/rikta-collection" element={<RequireAuth><RiktaCollection /></RequireAuth>} />
        <Route path="/rikta" element={<RequireAuth><Rikta /></RequireAuth>} />
        <Route path="/rikta/trad" element={<RequireAuth><RiktaTrad /></RequireAuth>} />
        <Route path="/rikta/cute" element={<RequireAuth><RiktaCute /></RequireAuth>} />
        <Route path="/rikta/family" element={<RequireAuth><Family /></RequireAuth>} />
        <Route path="/rikta/videos" element={<RequireAuth><Videos /></RequireAuth>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

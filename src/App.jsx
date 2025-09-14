import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RiktaHub from "./pages/RiktaHub";
import Rikta from "./pages/Rikta";
import RiktaVideos from "./pages/RiktaVideos";
import RiktaFamily from "./pages/RiktaFamily";
import Irfan from "./pages/Irfan";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";

function PrivateRoute({ children }) {
  const auth = localStorage.getItem("auth");
  return auth === "true" ? children : <Navigate to="/welcome" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/rikta"
          element={
            <PrivateRoute>
              <RiktaHub />
            </PrivateRoute>
          }
        />
        <Route
          path="/rikta/photos"
          element={
            <PrivateRoute>
              <Rikta />
            </PrivateRoute>
          }
        />
        <Route
          path="/rikta/videos"
          element={
            <PrivateRoute>
              <RiktaVideos />
            </PrivateRoute>
          }
        />
        <Route
          path="/rikta/family"
          element={
            <PrivateRoute>
              <RiktaFamily />
            </PrivateRoute>
          }
        />
        <Route
          path="/irfan"
          element={
            <PrivateRoute>
              <Irfan />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

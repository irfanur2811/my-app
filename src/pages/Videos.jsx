import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import "./Videos.css";

export default function Videos() {
  const videos = ["sample1.mp4"];
  return (
    <div>
      <HomeNavbar showBack backTo="/rikta-collection" />
      <div className="video-page">
        <h2>Rikta's Videos</h2>
        <div className="video-grid">
          {videos.map((v,i)=>(
            <div className="video-card" key={i}>
              <video controls src={`/videos/${v}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

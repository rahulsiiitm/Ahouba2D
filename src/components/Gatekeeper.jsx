// Gatekeeper.jsx
import React, { useState, useEffect } from 'react';
import './Gatekeeper.css';

const Gatekeeper = ({ onSelect }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) {
      onSelect('2d');
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onSelect]);

  return (
    <div className="manga-gate">
      {/* Speed lines reused from your AnimeHero component */}
      <div className="speed-lines"></div> 
      
      <div className="choice-stage">
        {/* 3D / Anime Cover Side */}
        <div className="manga-panel p-3d" onClick={() => onSelect('3d')}>
          <div className="panel-image anime-bg"></div>
          <div className="panel-overlay blue-tint"></div>
          <div className="panel-content">
            <h2 className="panel-text">DIGITAL</h2>
            <span className="sub-text">ENTER 3D WORLD</span>
          </div>
        </div>

        {/* 2D / Manga Cover Side */}
        <div className="manga-panel p-2d" onClick={() => onSelect('2d')}>
          <div className="panel-image manga-bg"></div>
          <div className="panel-overlay orange-tint"></div>
          <div className="panel-content">
            <h2 className="panel-text">UNIVERSE</h2>
            <span className="sub-text">ENTER 2D MANGA</span>
          </div>
        </div>
      </div>

      <div className="impact-zone">
        <div className="logo-seal">AHOUBA</div>
        <h1 className="vs-title">CHOOSE<br/><span>YOUR SIDE</span></h1>
        
        <div className="gate-timer">
          <div className="timer-progress" style={{ width: `${timeLeft * 10}%` }}></div>
          <span className="timer-count">INITIALIZING IN {timeLeft}S</span>
        </div>
      </div>
    </div>
  );
};

export default Gatekeeper;
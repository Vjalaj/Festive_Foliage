"use client";

import React, { useState, useEffect } from 'react';
import './snow.css';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  sway: number;
}

export const FallingSnow = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate snowflakes only on client to avoid hydration mismatch
  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -20,
      opacity: 0.4 + Math.random() * 0.6,
      sway: 20 + Math.random() * 40,
    }));
    setSnowflakes(flakes);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className="stars-bg" />
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" />
      </>
    );
  }

  return (
    <>
      {/* Stars background */}
      <div className="stars-bg" />
      
      {/* Snow container */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              ['--sway' as string]: `${flake.sway}px`,
            }}
          />
        ))}
      </div>
    </>
  );
};

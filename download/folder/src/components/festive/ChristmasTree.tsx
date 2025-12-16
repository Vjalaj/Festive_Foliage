"use client";

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

interface ChristmasTreeProps {
  children: React.ReactNode;
  onDrop: (item: { name: string }, x: number, y: number) => void;
}

export const ChristmasTree = ({ children, onDrop }: ChristmasTreeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: 'decoration',
    drop: (item: { name: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const treeBounds = ref.current?.getBoundingClientRect();
      if (offset && treeBounds) {
        onDrop(item, offset.x - treeBounds.left, offset.y - treeBounds.top);
      }
    },
  }), [onDrop]);

  return (
    <div ref={drop} className="relative w-full h-full flex items-center justify-center">
      <div ref={ref} className="relative w-[400px] h-[600px] md:w-[500px] md:h-[750px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 168 252"
          className="w-full h-full drop-shadow-2xl"
          aria-label="Christmas Tree"
        >
          <g>
            <path fill="#1A4314" d="m84 0l-58.5 73.125h29.25l-43.875 54.84375h36.5625l-43.875 54.84375h158.25l-43.875-54.84375h36.5625l-43.875-54.84375h29.25z"/>
            <path fill="#6A4028" d="m63 218h42v34h-42z"/>
            <circle cx="84" cy="20" r="3" className="twinkle-light" style={{ fill: '#FFC300', animationDelay: '0s' }} />
            <circle cx="60" cy="60" r="3" className="twinkle-light" style={{ fill: '#C70039', animationDelay: '0.5s' }} />
            <circle cx="110" cy="80" r="3" className="twinkle-light" style={{ fill: '#3498DB', animationDelay: '1s' }} />
            <circle cx="40" cy="110" r="3" className="twinkle-light" style={{ fill: '#FFC300', animationDelay: '1.5s' }} />
            <circle cx="130" cy="130" r="3" className="twinkle-light" style={{ fill: '#C70039', animationDelay: '2s' }} />
            <circle cx="84" cy="150" r="3" className="twinkle-light" style={{ fill: '#3498DB', animationDelay: '2.5s' }} />
            <circle cx="50" cy="180" r="3" className="twinkle-light" style={{ fill: '#FFC300', animationDelay: '3s' }} />
            <circle cx="120" cy="200" r="3" className="twinkle-light" style={{ fill: '#C70039', animationDelay: '3.5s' }} />
          </g>
        </svg>
        <style jsx>{`
            .twinkle-light {
                animation: twinkle 2s infinite;
            }
            @keyframes twinkle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
            }
        `}</style>
        
        <div className="absolute top-0 left-0 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

interface ChristmasTreeProps {
  children: React.ReactNode;
  onDrop: (item: { name: string }, x: number, y: number) => void;
  onMoveDecoration?: (id: string, x: number, y: number) => void;
}

export const ChristmasTree = ({ children, onDrop, onMoveDecoration }: ChristmasTreeProps) => {
  const treeAreaRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: ['decoration', 'decoration-on-tree'],
    drop: (item: { name?: string; id?: string; x?: number; y?: number }, monitor) => {
      const offset = monitor.getClientOffset();
      const treeBounds = treeAreaRef.current?.getBoundingClientRect();
      if (offset && treeBounds) {
        const newX = offset.x - treeBounds.left;
        const newY = offset.y - treeBounds.top;
        
        // Check if this is moving an existing decoration
        if (item.id && onMoveDecoration) {
          onMoveDecoration(item.id, newX, newY);
        } else if (item.name) {
          // New decoration being dropped
          onDrop(item as { name: string }, newX, newY);
        }
      }
    },
  }), [onDrop, onMoveDecoration]);

  return (
    <div ref={drop} className="relative w-full h-full">
      <div ref={treeAreaRef} className="relative w-full h-full">
        {/* Magical glow behind tree */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[280px] h-[400px] bg-gradient-radial from-emerald-500/20 via-transparent to-transparent blur-3xl" />
        </div>
        
        {/* The Tree SVG */}
        <svg
          viewBox="0 0 300 450"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Rich tree gradients */}
            <linearGradient id="treeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="50%" stopColor="#1B5E20" />
              <stop offset="100%" stopColor="#0D3B0F" />
            </linearGradient>
            <linearGradient id="treeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#388E3C" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4E342E" />
              <stop offset="50%" stopColor="#6D4C41" />
              <stop offset="100%" stopColor="#3E2723" />
            </linearGradient>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF9C4" stopOpacity="1" />
              <stop offset="60%" stopColor="#FFD700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Snow texture */}
            <pattern id="snowTexture" patternUnits="userSpaceOnUse" width="8" height="8">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
              <circle cx="6" cy="6" r="0.5" fill="rgba(255,255,255,0.2)" />
            </pattern>
          </defs>

          {/* Ground snow mound */}
          <ellipse cx="150" cy="420" rx="120" ry="25" fill="url(#snowTexture)" />
          <ellipse cx="150" cy="420" rx="120" ry="25" fill="rgba(255,255,255,0.4)" />
          
          {/* Trunk */}
          <rect x="125" y="370" width="50" height="50" rx="3" fill="url(#trunkGrad)" />
          <rect x="127" y="370" width="8" height="50" fill="rgba(0,0,0,0.15)" />
          <rect x="165" y="370" width="8" height="50" fill="rgba(255,255,255,0.08)" />

          {/* Tree layers - bottom to top */}
          {/* Layer 4 - bottom */}
          <path d="M150 250 L40 375 L260 375 Z" fill="url(#treeGrad1)" />
          <path d="M150 250 L40 375 L150 375 Z" fill="url(#treeGrad2)" opacity="0.4" />
          <path d="M150 255 L55 370 L100 370" fill="rgba(255,255,255,0.08)" />
          
          {/* Layer 3 */}
          <path d="M150 180 L55 290 L245 290 Z" fill="url(#treeGrad1)" />
          <path d="M150 180 L55 290 L150 290 Z" fill="url(#treeGrad2)" opacity="0.4" />
          <path d="M150 185 L70 285 L110 285" fill="rgba(255,255,255,0.08)" />
          
          {/* Layer 2 */}
          <path d="M150 115 L75 210 L225 210 Z" fill="url(#treeGrad1)" />
          <path d="M150 115 L75 210 L150 210 Z" fill="url(#treeGrad2)" opacity="0.4" />
          <path d="M150 120 L88 205 L120 205" fill="rgba(255,255,255,0.08)" />
          
          {/* Layer 1 - top */}
          <path d="M150 55 L100 120 L200 120 Z" fill="url(#treeGrad1)" />
          <path d="M150 55 L100 120 L150 120 Z" fill="url(#treeGrad2)" opacity="0.4" />
          <path d="M150 60 L110 115 L130 115" fill="rgba(255,255,255,0.1)" />

          {/* Star on top */}
          <g transform="translate(150, 42)" filter="url(#glow)">
            <circle r="25" fill="url(#starGlow)" opacity="0.6" />
            <polygon 
              points="0,-18 5,-6 18,-6 8,2 12,15 0,8 -12,15 -8,2 -18,-6 -5,-6" 
              fill="url(#starGrad)"
              className="animate-pulse"
            />
          </g>

          {/* Decorative lights - strings of lights */}
          <g className="tree-lights" filter="url(#softGlow)">
            {/* Top section */}
            <circle cx="130" cy="85" r="4" fill="#FF5252" className="animate-twinkle" />
            <circle cx="170" cy="90" r="4" fill="#69F0AE" className="animate-twinkle" style={{ animationDelay: '0.3s' }} />
            
            {/* Second section */}
            <circle cx="105" cy="145" r="4" fill="#448AFF" className="animate-twinkle" style={{ animationDelay: '0.6s' }} />
            <circle cx="150" cy="155" r="4" fill="#FFD740" className="animate-twinkle" style={{ animationDelay: '0.9s' }} />
            <circle cx="195" cy="148" r="4" fill="#FF4081" className="animate-twinkle" style={{ animationDelay: '1.2s' }} />
            
            {/* Third section */}
            <circle cx="85" cy="225" r="4.5" fill="#69F0AE" className="animate-twinkle" style={{ animationDelay: '1.5s' }} />
            <circle cx="125" cy="240" r="4.5" fill="#FF5252" className="animate-twinkle" style={{ animationDelay: '1.8s' }} />
            <circle cx="175" cy="235" r="4.5" fill="#448AFF" className="animate-twinkle" style={{ animationDelay: '2.1s' }} />
            <circle cx="215" cy="228" r="4.5" fill="#FFD740" className="animate-twinkle" style={{ animationDelay: '2.4s' }} />
            
            {/* Bottom section */}
            <circle cx="65" cy="310" r="5" fill="#FF4081" className="animate-twinkle" style={{ animationDelay: '2.7s' }} />
            <circle cx="110" cy="325" r="5" fill="#69F0AE" className="animate-twinkle" style={{ animationDelay: '3s' }} />
            <circle cx="150" cy="315" r="5" fill="#FF5252" className="animate-twinkle" style={{ animationDelay: '3.3s' }} />
            <circle cx="190" cy="328" r="5" fill="#448AFF" className="animate-twinkle" style={{ animationDelay: '3.6s' }} />
            <circle cx="235" cy="312" r="5" fill="#FFD740" className="animate-twinkle" style={{ animationDelay: '3.9s' }} />
          </g>
          
          {/* Tinsel/garland curves */}
          <g stroke="rgba(255,215,0,0.5)" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M110 100 Q150 115 190 100" />
            <path d="M85 175 Q150 200 215 175" />
            <path d="M65 260 Q150 295 235 260" />
            <path d="M50 345 Q150 385 250 345" />
          </g>
        </svg>

        {/* Decorations overlay */}
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0% { opacity: 0.6; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

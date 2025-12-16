import React from 'react';

// Helper to darken/lighten color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export const Bauble = ({ color = '#E53935' }: { color?: string }) => (
  <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
    <defs>
      <linearGradient id={`bg-${color.slice(1)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={adjustColor(color, 30)} />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor={adjustColor(color, -40)} />
      </linearGradient>
      <radialGradient id={`shine-${color.slice(1)}`} cx="30%" cy="25%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="16" y="2" width="8" height="6" rx="1" fill="#C9A227" />
    <circle cx="20" cy="6" r="3" stroke="#888" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="30" r="17" fill={`url(#bg-${color.slice(1)})`} />
    <circle cx="20" cy="30" r="17" fill={`url(#shine-${color.slice(1)})`} />
  </svg>
);

export const Star = () => (
  <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
    <defs>
      <linearGradient id="starG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA000" />
      </linearGradient>
      <filter id="starF" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.5" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <polygon points="22.5,3 27,17 42,17 30,26 35,40 22.5,31 10,40 15,26 3,17 18,17" fill="url(#starG)" filter="url(#starF)" />
  </svg>
);

export const CandyCane = () => (
  <svg width="35" height="50" viewBox="0 0 35 50" fill="none">
    <defs>
      <pattern id="stripes" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <rect width="3" height="6" fill="#D32F2F" />
        <rect x="3" width="3" height="6" fill="white" />
      </pattern>
    </defs>
    <path d="M12 48 L12 22 Q12 8 22 8 Q32 8 32 18" stroke="url(#stripes)" strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);

export const Snowflake = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <g transform="translate(20,20)" stroke="#E3F2FD" strokeWidth="2" strokeLinecap="round">
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-16" />
          <line x1="0" y1="-10" x2="-4" y2="-14" />
          <line x1="0" y1="-10" x2="4" y2="-14" />
        </g>
      ))}
      <circle r="3" fill="#E3F2FD" />
    </g>
  </svg>
);

export const GiftBox = () => (
  <svg width="40" height="45" viewBox="0 0 40 45" fill="none">
    <defs>
      <linearGradient id="boxG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E53935" />
        <stop offset="100%" stopColor="#B71C1C" />
      </linearGradient>
    </defs>
    <rect x="3" y="15" width="34" height="27" rx="2" fill="url(#boxG)" />
    <rect x="1" y="10" width="38" height="7" rx="2" fill="url(#boxG)" />
    <rect x="17" y="10" width="6" height="32" fill="#FFD700" />
    <rect x="1" y="12" width="38" height="4" fill="#FFD700" />
    <ellipse cx="14" cy="8" rx="5" ry="3" fill="#FFD700" transform="rotate(-15 14 8)" />
    <ellipse cx="26" cy="8" rx="5" ry="3" fill="#FFD700" transform="rotate(15 26 8)" />
    <circle cx="20" cy="10" r="3" fill="#FFA000" />
  </svg>
);

export const Bell = () => (
  <svg width="38" height="45" viewBox="0 0 38 45" fill="none">
    <defs>
      <linearGradient id="bellG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD54F" />
        <stop offset="100%" stopColor="#FF8F00" />
      </linearGradient>
    </defs>
    <path d="M15 7 Q19 3 23 7" stroke="#C62828" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="19" cy="5" r="2.5" fill="#C62828" />
    <path d="M7 32 Q7 14 19 12 Q31 14 31 32 L33 35 L5 35 Z" fill="url(#bellG)" />
    <ellipse cx="19" cy="39" rx="5" ry="4" fill="#E65100" />
  </svg>
);

export const Ribbon = ({ color = '#E53935' }: { color?: string }) => (
  <svg width="50" height="35" viewBox="0 0 50 35" fill="none">
    <defs>
      <linearGradient id={`ribG-${color.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={adjustColor(color, 20)} />
        <stop offset="100%" stopColor={adjustColor(color, -30)} />
      </linearGradient>
    </defs>
    <path d="M5 18 Q15 5 25 18 Q35 5 45 18 L42 32 Q25 22 8 32 Z" fill={`url(#ribG-${color.slice(1)})`} />
    <ellipse cx="25" cy="18" rx="6" ry="4" fill={adjustColor(color, -20)} />
  </svg>
);

export const Gingerbread = () => (
  <svg width="38" height="45" viewBox="0 0 38 45" fill="none">
    <defs>
      <linearGradient id="gingG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A1887F" />
        <stop offset="100%" stopColor="#6D4C41" />
      </linearGradient>
    </defs>
    <circle cx="19" cy="10" r="8" fill="url(#gingG)" />
    <rect x="12" y="16" width="14" height="14" rx="2" fill="url(#gingG)" />
    <rect x="6" y="18" width="8" height="4" rx="2" fill="url(#gingG)" />
    <rect x="24" y="18" width="8" height="4" rx="2" fill="url(#gingG)" />
    <rect x="13" y="28" width="5" height="12" rx="2" fill="url(#gingG)" />
    <rect x="20" y="28" width="5" height="12" rx="2" fill="url(#gingG)" />
    <circle cx="15" cy="9" r="1.5" fill="white" />
    <circle cx="23" cy="9" r="1.5" fill="white" />
    <path d="M16 13 Q19 15 22 13" stroke="white" strokeWidth="1" fill="none" />
    <circle cx="16" cy="22" r="1.5" fill="white" />
    <circle cx="22" cy="22" r="1.5" fill="white" />
  </svg>
);

export const Holly = () => (
  <svg width="45" height="35" viewBox="0 0 45 35" fill="none">
    <ellipse cx="15" cy="20" rx="10" ry="6" fill="#2E7D32" transform="rotate(-30 15 20)" />
    <ellipse cx="30" cy="20" rx="10" ry="6" fill="#388E3C" transform="rotate(30 30 20)" />
    <ellipse cx="22" cy="28" rx="8" ry="5" fill="#1B5E20" transform="rotate(0 22 28)" />
    <circle cx="20" cy="12" r="4" fill="#C62828" />
    <circle cx="26" cy="14" r="3.5" fill="#D32F2F" />
    <circle cx="23" cy="18" r="3" fill="#B71C1C" />
  </svg>
);

export const Stocking = () => (
  <svg width="35" height="50" viewBox="0 0 35 50" fill="none">
    <defs>
      <linearGradient id="stockG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C62828" />
        <stop offset="100%" stopColor="#D32F2F" />
      </linearGradient>
    </defs>
    <path d="M8 5 L8 28 Q8 38 18 42 L28 46 Q32 42 30 35 L25 25 L25 5 Z" fill="url(#stockG)" />
    <rect x="6" y="3" width="21" height="8" rx="2" fill="white" />
    <rect x="6" y="3" width="21" height="3" fill="#E8E8E8" />
  </svg>
);

export const Candy = ({ color = '#E53935' }: { color?: string }) => (
  <svg width="40" height="22" viewBox="0 0 40 22" fill="none">
    <defs>
      <linearGradient id={`candyG-${color.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={adjustColor(color, 30)} />
        <stop offset="100%" stopColor={adjustColor(color, -20)} />
      </linearGradient>
    </defs>
    <ellipse cx="20" cy="11" rx="12" ry="9" fill={`url(#candyG-${color.slice(1)})`} />
    <path d="M8 11 L3 6 M8 11 L3 16" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M32 11 L37 6 M32 11 L37 16" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="16" cy="8" rx="2" ry="1.5" fill="rgba(255,255,255,0.5)" />
  </svg>
);

export const Glitter = ({ color = '#FFD700' }: { color?: string }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <g fill={color}>
      <polygon points="15,2 16.5,12 15,13 13.5,12" />
      <polygon points="15,28 16.5,18 15,17 13.5,18" />
      <polygon points="2,15 12,13.5 13,15 12,16.5" />
      <polygon points="28,15 18,13.5 17,15 18,16.5" />
      <polygon points="6,6 11,12 12,13 13,12" transform="rotate(45 15 15)" />
      <polygon points="24,6 19,12 18,13 17,12" transform="rotate(-45 15 15)" />
    </g>
    <circle cx="15" cy="15" r="3" fill={adjustColor(color, 30)} />
  </svg>
);

export const Wreath = () => (
  <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
    <circle cx="22.5" cy="22.5" r="16" stroke="#2E7D32" strokeWidth="8" fill="none" />
    <circle cx="22.5" cy="22.5" r="16" stroke="#388E3C" strokeWidth="4" strokeDasharray="6 8" fill="none" />
    <circle cx="22.5" cy="6" r="3" fill="#C62828" />
    <circle cx="18" cy="7" r="2.5" fill="#D32F2F" />
    <circle cx="27" cy="7" r="2.5" fill="#B71C1C" />
    <path d="M15 4 Q22.5 0 30 4" stroke="#C62828" strokeWidth="2" fill="none" />
  </svg>
);

export const Snowman = () => (
  <svg width="35" height="50" viewBox="0 0 35 50" fill="none">
    <circle cx="17.5" cy="38" r="10" fill="white" stroke="#E0E0E0" strokeWidth="1" />
    <circle cx="17.5" cy="22" r="8" fill="white" stroke="#E0E0E0" strokeWidth="1" />
    <circle cx="17.5" cy="9" r="6" fill="white" stroke="#E0E0E0" strokeWidth="1" />
    <circle cx="15" cy="8" r="1" fill="#333" />
    <circle cx="20" cy="8" r="1" fill="#333" />
    <polygon points="17.5,10 17.5,13 22,11" fill="#FF9800" />
    <circle cx="17.5" cy="20" r="1" fill="#333" />
    <circle cx="17.5" cy="24" r="1" fill="#333" />
    <rect x="11" y="2" width="13" height="4" rx="1" fill="#333" />
    <rect x="14" y="0" width="7" height="3" rx="1" fill="#333" />
    <rect x="6" y="14" width="23" height="3" rx="1" fill="#C62828" />
  </svg>
);

export const Angel = () => (
  <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
    <ellipse cx="20" cy="5" rx="8" ry="2" fill="#FFD700" />
    <circle cx="20" cy="14" r="7" fill="#FFCCBC" />
    <path d="M13 20 L20 45 L27 20 Q20 25 13 20" fill="white" />
    <path d="M8 22 Q3 15 10 18 L15 24" fill="white" />
    <path d="M32 22 Q37 15 30 18 L25 24" fill="white" />
    <circle cx="17" cy="13" r="1" fill="#333" />
    <circle cx="23" cy="13" r="1" fill="#333" />
    <path d="M18 16 Q20 17 22 16" stroke="#E57373" strokeWidth="0.8" fill="none" />
  </svg>
);

export const Ornament = ({ pattern = 'stripes', color = '#1976D2' }: { pattern?: string; color?: string }) => (
  <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
    <defs>
      <linearGradient id={`ornG-${color.slice(1)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={adjustColor(color, 40)} />
        <stop offset="100%" stopColor={adjustColor(color, -30)} />
      </linearGradient>
      <pattern id={`ornP-${color.slice(1)}`} patternUnits="userSpaceOnUse" width="8" height="8">
        {pattern === 'stripes' && <><rect width="4" height="8" fill={color} /><rect x="4" width="4" height="8" fill={adjustColor(color, 40)} /></>}
        {pattern === 'dots' && <><rect width="8" height="8" fill={color} /><circle cx="4" cy="4" r="2" fill="white" opacity="0.5" /></>}
        {pattern === 'zigzag' && <path d="M0 4 L4 0 L8 4 L4 8 Z" fill={adjustColor(color, 30)} />}
      </pattern>
      <clipPath id={`ornC-${color.slice(1)}`}><circle cx="20" cy="30" r="16" /></clipPath>
    </defs>
    <rect x="16" y="2" width="8" height="6" rx="1" fill="#C9A227" />
    <circle cx="20" cy="6" r="3" stroke="#888" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="30" r="16" fill={`url(#ornG-${color.slice(1)})`} />
    <circle cx="20" cy="30" r="16" fill={`url(#ornP-${color.slice(1)})`} clipPath={`url(#ornC-${color.slice(1)})`} opacity="0.4" />
    <ellipse cx="14" cy="24" rx="4" ry="3" fill="rgba(255,255,255,0.4)" />
  </svg>
);

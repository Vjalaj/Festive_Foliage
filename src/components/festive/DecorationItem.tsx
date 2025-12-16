"use client";

import React from 'react';
import type { DecorationOption, Decoration } from '@/lib/types';

interface DecorationItemProps {
  item: DecorationOption;
  addDecoration: (decoration: Omit<Decoration, 'id'>) => void;
}

export const DecorationItem = ({ item, addDecoration }: DecorationItemProps) => {
  // Generate random position within typical tree bounds
  const getRandomPosition = () => ({
    x: 100 + Math.random() * 220, // Random x between 100-320
    y: 100 + Math.random() * 350, // Random y between 100-450
  });

  const handleClick = () => {
    const pos = getRandomPosition();
    addDecoration({
      type: item.type as Decoration['type'],
      component: item.component,
      name: item.name,
      x: pos.x,
      y: pos.y,
      scale: item.defaultScale || 1,
      rotation: 0,
    });
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer transition-all duration-200 opacity-100 hover:scale-110" 
      title={`Click to add ${item.name}`}
    >
      <div className="bg-white/10 hover:bg-white/20 rounded-xl p-2 flex flex-col items-center justify-center aspect-square border border-white/10 hover:border-white/30 transition-colors shadow-lg hover:shadow-xl">
        <div className="transform scale-[0.7]">
          <item.component />
        </div>
        <span className="text-[10px] text-white/60 mt-1 text-center truncate w-full px-1">
          {item.name}
        </span>
      </div>
    </div>
  );
};

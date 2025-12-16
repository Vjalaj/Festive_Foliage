"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';

interface FullAreaDropZoneProps {
  children: React.ReactNode;
  onDrop: (item: { name: string }, x: number, y: number) => void;
}

export const FullAreaDropZone = ({ children, onDrop }: FullAreaDropZoneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // Track mouse position for fallback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        lastMousePos.current = {
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (containerRef.current && e.touches[0]) {
        const bounds = containerRef.current.getBoundingClientRect();
        lastMousePos.current = {
          x: e.touches[0].clientX - bounds.left,
          y: e.touches[0].clientY - bounds.top,
        };
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['decoration'],  // Only accept NEW decorations from panel, not decoration-on-tree
    drop: (item: { name?: string }, monitor) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      
      // Try multiple methods to get the drop position
      let offset = monitor.getClientOffset();
      if (!offset) {
        offset = monitor.getSourceClientOffset();
      }
      
      let newX: number, newY: number;
      
      if (offset && bounds) {
        newX = offset.x - bounds.left;
        newY = offset.y - bounds.top;
      } else if (lastMousePos.current) {
        // Use tracked mouse position as fallback
        console.log('Using tracked mouse position:', lastMousePos.current);
        newX = lastMousePos.current.x;
        newY = lastMousePos.current.y;
      } else if (bounds) {
        // Ultimate fallback: center
        console.log('Using center fallback');
        newX = bounds.width / 2;
        newY = bounds.height / 2;
      } else {
        return undefined;
      }

      console.log('New decoration drop position:', { newX, newY, item });
      
      if (item.name) {
        // New decoration from panel
        onDrop(item as { name: string }, newX, newY);
      }
      
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop]);

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    drop(el);
  };

  return (
    <div 
      ref={setRefs} 
      className="relative w-full h-full"
      style={{
        backgroundColor: isOver ? 'rgba(255,255,255,0.02)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
};

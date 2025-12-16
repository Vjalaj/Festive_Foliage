"use client";

import React, { useState, useRef, useEffect, useCallback, ComponentType } from 'react';
import { ornaments, stickers, extras } from '@/lib/decorations';
import { Bauble } from './DecorationSVGs';
import { useDrag } from 'react-dnd';
import { Grip, RotateCcw } from 'lucide-react';
import { Decoration } from '@/lib/types';

interface DraggableDecorationProps {
  decoration: Decoration;
  onUpdate: (id: string, updates: Partial<Decoration>) => void;
  onRemove: (id: string) => void;
  isAdmin?: boolean;
  onAdminClick?: (decoration: Decoration, event: React.MouseEvent) => void;
}

export const DraggableDecoration = ({ decoration, onUpdate, onRemove, isAdmin, onAdminClick }: DraggableDecorationProps) => {
  const { id, component: runtimeComponent, name, type, scale = 1, rotation = 0, data } = decoration as any;
  const [isSelected, setIsSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Get current position - use x/y directly for pixel positioning
  const posX = (decoration as any).x ?? 150;
  const posY = (decoration as any).y ?? 200;

  // Handle drag manually with mouse/touch events
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isAdmin) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartPos.current = { x: clientX - posX, y: clientY - posY };
    
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!dragStartPos.current) return;
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      // Get parent bounds for clamping
      const parent = ref.current?.parentElement;
      if (parent) {
        const bounds = parent.getBoundingClientRect();
        const newX = Math.max(0, Math.min(bounds.width, moveX - bounds.left));
        const newY = Math.max(0, Math.min(bounds.height, moveY - bounds.top));
        
        // Update position in real-time
        if (ref.current) {
          ref.current.style.left = `${newX}px`;
          ref.current.style.top = `${newY}px`;
        }
      }
    };
    
    const handleUp = (upEvent: MouseEvent | TouchEvent) => {
      if (!dragStartPos.current) return;
      
      const upX = 'changedTouches' in upEvent ? upEvent.changedTouches[0].clientX : upEvent.clientX;
      const upY = 'changedTouches' in upEvent ? upEvent.changedTouches[0].clientY : upEvent.clientY;
      
      const parent = ref.current?.parentElement;
      if (parent) {
        const bounds = parent.getBoundingClientRect();
        const newX = Math.max(0, Math.min(bounds.width, upX - bounds.left));
        const newY = Math.max(0, Math.min(bounds.height, upY - bounds.top));
        
        console.log('Manual drag ended, new position:', { newX, newY });
        onUpdate(id, { x: newX, y: newY });
      }
      
      dragStartPos.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);
  }, [id, posX, posY, isAdmin, onUpdate]);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'decoration-on-tree',
      item: { id, x: posX, y: posY },
      canDrag: false, // Disable react-dnd drag, use manual instead
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, posX, posY]
  );

  const handleInteractionStart = useCallback((e: React.MouseEvent | React.TouchEvent, action: 'resize' | 'rotate') => {
    e.preventDefault();
    e.stopPropagation();

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in moveEvent ? moveEvent.touches[0] : moveEvent;

      if (action === 'resize') {
        const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
        const newScale = Math.max(0.3, Math.min(3, distance / 40));
        onUpdate(id, { scale: newScale });
      } else if (action === 'rotate') {
        const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        onUpdate(id, { rotation: angle + 90 });
      }
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchend', upHandler);
  }, [id, scale, onUpdate]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isAdmin && onAdminClick) {
      e.stopPropagation();
      onAdminClick(decoration, e);
    } else {
      setIsSelected(true);
    }
  }, [isAdmin, onAdminClick, decoration]);

  // Render the decoration component
  const renderContent = () => {
    let Comp: ComponentType<any> | null = runtimeComponent || null;
    if (!Comp && name) {
      const all = [...ornaments, ...stickers, ...extras];
      const found = all.find((d) => d.name === name);
      if (found) Comp = found.component as ComponentType<any>;
    }

    if (!Comp) {
      if (type === 'text') {
        return (
          <span className="bg-white/90 text-gray-800 px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm select-none border border-white/50">
            {data?.text}
          </span>
        );
      }
      if (type === 'image') {
        return (
          <img 
            src={data?.src} 
            alt="user upload" 
            className="w-14 h-14 rounded-full border-3 border-white object-cover shadow-lg" 
          />
        );
      }
      if (type === 'ornament') {
        return <Bauble color={data?.color || '#C70039'} />;
      }
      return <div className="w-10 h-10 bg-white/10 rounded-full" />;
    }

    return <Comp {...data} />;
  };

  if (isDragging) {
    return <div style={{ opacity: 0 }} />;
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) scale(${scale * (isSelected ? 1.05 : 1)}) rotate(${rotation}deg)`,
        cursor: isAdmin ? 'pointer' : 'grab',
        zIndex: isSelected ? 100 : 10,
        transition: isSelected ? 'transform 100ms ease' : 'none',
        pointerEvents: 'auto',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={handleClick}
      className="group"
    >
      <div 
        className="relative" 
        style={{ 
          filter: isSelected ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}
      >
        {renderContent()}
      </div>

      {isSelected && !isAdmin && (
        <>
          <div className="absolute -inset-3 border-2 border-dashed border-yellow-400 rounded-xl pointer-events-none animate-pulse" />
          <div
            className="absolute -bottom-4 -right-4 bg-white rounded-full p-1.5 cursor-nwse-resize shadow-lg hover:scale-110 transition-transform"
            onMouseDown={(e) => handleInteractionStart(e, 'resize')}
            onTouchStart={(e) => handleInteractionStart(e, 'resize')}
          >
            <Grip className="w-4 h-4 text-gray-600" />
          </div>
          <div
            className="absolute -top-4 -right-4 bg-white rounded-full p-1.5 cursor-alias shadow-lg hover:scale-110 transition-transform"
            onMouseDown={(e) => handleInteractionStart(e, 'rotate')}
            onTouchStart={(e) => handleInteractionStart(e, 'rotate')}
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </div>
        </>
      )}
    </div>
  );
};

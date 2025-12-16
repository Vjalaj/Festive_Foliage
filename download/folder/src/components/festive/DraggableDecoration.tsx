"use client";

import React, { useState, useRef, useEffect, ComponentType } from 'react';
import { useDrag } from 'react-dnd';
import { Grip, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Decoration } from '@/lib/types';

interface DraggableDecorationProps {
  decoration: Decoration;
  onUpdate: (id: string, updates: Partial<Decoration>) => void;
  onRemove: (id: string) => void;
}

export const DraggableDecoration = ({ decoration, onUpdate, onRemove }: DraggableDecorationProps) => {
  const { id, component: Component, x, y, scale, rotation, data } = decoration;
  const [isSelected, setIsSelected] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: `decoration-on-tree`,
      item: { id, x, y },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          onUpdate(item.id, { x: item.x + delta.x, y: item.y + delta.y });
        }
      },
    }),
    [id, x, y, onUpdate]
  );
  
  drag(ref);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, action: 'resize' | 'rotate') => {
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
        const newScale = scale + (clientX - rect.right) * 0.01;
        onUpdate(id, { scale: Math.max(0.1, newScale) });
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
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        cursor: 'grab',
        display: isDragging ? 'none' : 'block'
      }}
      onClick={() => setIsSelected(true)}
      className="group"
    >
      <div className="relative">
        <Component {...data} />
      </div>

      {isSelected && (
        <>
          <div className="absolute -inset-2 border-2 border-dashed border-accent rounded-lg pointer-events-none" />
          <div
            className="absolute -bottom-3 -right-3 bg-background rounded-full p-1 cursor-nwse-resize shadow-lg"
            onMouseDown={(e) => handleInteractionStart(e, 'resize')}
            onTouchStart={(e) => handleInteractionStart(e, 'resize')}
          >
            <Grip className="w-4 h-4 text-accent-foreground" />
          </div>
          <div
            className="absolute -top-3 -right-3 bg-background rounded-full p-1 cursor-alias shadow-lg"
            onMouseDown={(e) => handleInteractionStart(e, 'rotate')}
            onTouchStart={(e) => handleInteractionStart(e, 'rotate')}
          >
            <RotateCcw className="w-4 h-4 text-accent-foreground" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-3 -left-3 h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};

"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '@/components/ui/card';
import type { DecorationOption } from '@/lib/types';

interface DecorationItemProps {
  item: DecorationOption;
}

export const DecorationItem = ({ item }: DecorationItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'decoration',
    item: { name: item.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`} title={`Drag to add ${item.name}`}>
      <Card className="hover:border-accent hover:shadow-lg transition-all transform hover:-translate-y-1">
        <CardContent className="p-2 flex items-center justify-center aspect-square">
          <div className="transform scale-75">
            <item.component />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

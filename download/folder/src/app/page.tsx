"use client";

import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Share2, Wand2 } from 'lucide-react';
import html2canvas from 'html2canvas';

import { ChristmasTree } from '@/components/festive/ChristmasTree';
import { DecorationPanel } from '@/components/festive/DecorationPanel';
import { DraggableDecoration } from '@/components/festive/DraggableDecoration';
import { FallingSnow } from '@/components/festive/FallingSnow';
import type { Decoration } from '@/lib/types';
import { ornaments, stickers } from '@/lib/decorations.tsx';

const allDecorations = [...ornaments, ...stickers];

export default function Home() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const { toast } = useToast();
  const treeRef = useRef<HTMLDivElement>(null);

  const addDecoration = (decoration: Omit<Decoration, 'id'>) => {
    setDecorations((prev) => [...prev, { ...decoration, id: `${decoration.type}-${Date.now()}` }]);
  };

  const updateDecoration = useCallback((id: string, updates: Partial<Decoration>) => {
    setDecorations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  }, []);
  
  const removeDecoration = (id: string) => {
    setDecorations((prev) => prev.filter(d => d.id !== id));
  };
  
  const handleDrop = useCallback((item: { name: string }, x: number, y: number) => {
    const droppedItem = allDecorations.find(d => d.name === item.name);
    if (droppedItem) {
      addDecoration({
        type: droppedItem.type as Decoration['type'],
        component: droppedItem.component,
        x,
        y,
        scale: droppedItem.defaultScale || 1,
        rotation: 0,
      });
    }
  }, []);

  const handleSaveImage = () => {
    if (treeRef.current) {
      html2canvas(treeRef.current, {
        backgroundColor: null,
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'festive-foliage-tree.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: "Image Saved!",
          description: "Your beautiful tree has been downloaded.",
        });
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My FestiveFoliage Tree',
      text: 'Check out the Christmas tree I decorated on FestiveFoliage!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
         toast({
          title: "Shared!",
          description: "Your tree has been shared.",
        });
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link Copied!",
          description: "Share the link with your friends.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not share the tree. Please try again.",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex h-screen w-full flex-col bg-background font-headline overflow-hidden">
        <FallingSnow />
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 md:px-6 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">FestiveFoliage</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={handleSaveImage}>
              <Download className="mr-2 h-4 w-4" />
              Save Image
            </Button>
          </div>
        </header>

        <main className="flex-1 grid grid-rows-[minmax(0,1fr)_auto] md:grid-rows-1 md:grid-cols-[1fr_auto] overflow-hidden">
          <div className="relative row-start-1 md:col-start-1 overflow-hidden" ref={treeRef}>
            <ChristmasTree onDrop={handleDrop}>
              {decorations.map((decoration) => (
                <DraggableDecoration
                  key={decoration.id}
                  decoration={decoration}
                  onUpdate={updateDecoration}
                  onRemove={removeDecoration}
                />
              ))}
            </ChristmasTree>
          </div>
          <div className="row-start-2 md:row-start-1 md:col-start-2">
              <DecorationPanel addDecoration={addDecoration} />
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

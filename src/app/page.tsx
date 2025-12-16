"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import html2canvas from 'html2canvas';

import { ChristmasTree } from '@/components/festive/ChristmasTree';
import { DecorationPanel } from '@/components/festive/DecorationPanel';
import { DraggableDecoration } from '@/components/festive/DraggableDecoration';
import { FallingSnow } from '@/components/festive/FallingSnow';
import { MusicPlayer } from '@/components/festive/MusicPlayer';
import { FullAreaDropZone } from '@/components/festive/FullAreaDropZone';
import type { Decoration } from '@/lib/types';
import { ornaments, stickers, extras } from '@/lib/decorations';

const allDecorations = [...ornaments, ...stickers, ...extras];

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function Home() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const { toast } = useToast();
  const treeRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    try {
      const sid = localStorage.getItem('sessionId');
      if (!sid) {
        const newId = `s-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
        localStorage.setItem('sessionId', newId);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/decorations');
        if (res.ok) {
          const data = await res.json();
          // Convert percentX/percentY to x/y if needed
          const bounds = treeRef.current?.getBoundingClientRect();
          const processed = (data || []).map((d: any) => {
            // If we have x/y, use them
            if (typeof d.x === 'number' && typeof d.y === 'number') {
              return d;
            }
            // Otherwise convert from percentX/percentY
            if (typeof d.percentX === 'number' && typeof d.percentY === 'number' && bounds) {
              return {
                ...d,
                x: d.percentX * bounds.width,
                y: d.percentY * bounds.height,
              };
            }
            // Fallback to center-ish position
            return { ...d, x: 150, y: 200 };
          });
          setDecorations(processed);
        }
      } catch (e) {}
    };
    // Small delay to ensure treeRef is mounted
    const timer = setTimeout(load, 100);
    return () => clearTimeout(timer);
  }, []);

  const addDecoration = async (decoration: Omit<Decoration, 'id'>) => {
    console.log('addDecoration called with:', decoration);
    try {
      const bounds = treeRef.current?.getBoundingClientRect();
      console.log('Tree bounds:', bounds);
      let payload: any = {
        type: decoration.type,
        name: (decoration as any).name,
        scale: decoration.scale,
        rotation: decoration.rotation,
        data: decoration.data || {},
      };

      if (bounds && typeof decoration.x === 'number' && typeof decoration.y === 'number') {
        payload.percentX = decoration.x / bounds.width;
        payload.percentY = decoration.y / bounds.height;
        payload.x = decoration.x;
        payload.y = decoration.y;
      } else {
        payload.x = decoration.x;
        payload.y = decoration.y;
      }
      
      console.log('Sending payload:', payload);

      const res = await fetch('/api/decorations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-session-id': localStorage.getItem('sessionId') || '' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        console.log('API returned:', created);
        setDecorations((prev) => [...prev, created]);
        toast({ title: '✨ Added!', description: 'Drag to reposition' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save decoration.' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save decoration.' });
    }
  };

  const updateDecoration = useCallback((id: string, updates: Partial<Decoration>) => {
    console.log('updateDecoration called:', { id, updates });
    (async () => {
      setDecorations((prev) => {
        const updated = prev.map((d) => (d.id === id ? { ...d, ...updates } : d));
        console.log('State updated, new decoration:', updated.find(d => d.id === id));
        return updated;
      });
      try {
        const bounds = treeRef.current?.getBoundingClientRect();
        let payload: any = { id };
        if (typeof updates.x === 'number' && typeof updates.y === 'number' && bounds) {
          payload.percentX = updates.x / bounds.width;
          payload.percentY = updates.y / bounds.height;
          payload.x = updates.x;
          payload.y = updates.y;
        } else {
          if (typeof updates.x === 'number') payload.x = updates.x;
          if (typeof updates.y === 'number') payload.y = updates.y;
        }
        await fetch('/api/decorations', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json', 'x-session-id': localStorage.getItem('sessionId') || '' },
          body: JSON.stringify(payload),
        });
      } catch (e) {}
    })();
  }, []);
  
  const removeDecoration = async (id: string) => {
    const user = window.prompt('Admin username:');
    if (!user) return;
    const pass = window.prompt('Admin password:');
    if (pass === null) return;

    try {
      const cred = btoa(`${user}:${pass}`);
      const res = await fetch('/api/decorations', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'authorization': `Basic ${cred}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const body = await res.json();
        setDecorations(body.decorations || []);
        toast({ title: 'Removed', description: 'Decoration removed.' });
      } else if (res.status === 401) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'Invalid admin credentials.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not remove decoration.' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not remove decoration.' });
    }
  };
  
  const handleDrop = useCallback((item: { name: string }, x: number, y: number) => {
    const droppedItem = allDecorations.find(d => d.name === item.name);
    if (droppedItem) {
      addDecoration({
        type: droppedItem.type as Decoration['type'],
        component: droppedItem.component,
        name: droppedItem.name,
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
        backgroundColor: '#0a1628',
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'my-christmas-tree.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({ title: "🎄 Saved!", description: "Your tree has been downloaded." });
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Christmas Tree',
      text: 'Check out the tree I decorated!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: "Shared!", description: "Your tree has been shared." });
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link Copied!", description: "Share the link with your friends." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not share." });
    }
  };

  const handleMoveDecoration = useCallback((id: string, x: number, y: number) => {
    console.log('handleMoveDecoration called:', { id, x, y });
    updateDecoration(id, { x, y });
  }, [updateDecoration]);

  const DndBackend = isTouch ? TouchBackend : HTML5Backend;
  const backendOptions = isTouch ? { enableMouseEvents: true } : undefined;

  return (
    <DndProvider backend={DndBackend} options={backendOptions}>
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#1a3a5c]">
        <FallingSnow />
        
        {/* Phone-sized container - centered on all devices */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-gradient-to-b from-[#0d1f35]/90 to-[#152a45]/90 rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm flex flex-col">
            
            {/* Header */}
            <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h1 className="text-lg font-bold text-white tracking-tight">FestiveFoliage</h1>
              </div>
              <div className="flex items-center gap-1.5">
                <MusicPlayer musicFile={process.env.NEXT_PUBLIC_MUSIC_FILE} />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare}
                  className="h-8 px-2 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveImage}
                  className="h-8 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-medium"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
              </div>
            </header>

            {/* Tree Area - Full drop zone for decorations anywhere */}
            <div className="flex-1 relative overflow-hidden" ref={treeRef}>
              <FullAreaDropZone onDrop={handleDrop}>
                {/* Tree visual (no longer handles drops) */}
                <ChristmasTree onDrop={() => {}} onMoveDecoration={() => {}}>
                  {null}
                </ChristmasTree>
                
                {/* Decorations layer - can be placed anywhere */}
                <div className="absolute inset-0 pointer-events-none">
                  {decorations.map((decoration) => (
                    <DraggableDecoration
                      key={decoration.id}
                      decoration={decoration}
                      onUpdate={updateDecoration}
                      onRemove={removeDecoration}
                      isAdmin={false}
                    />
                  ))}
                </div>
              </FullAreaDropZone>
            </div>

            {/* Panel toggle */}
            <button 
              onClick={() => setPanelOpen(!panelOpen)}
              className="shrink-0 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border-t border-white/10 text-white/70 hover:text-white transition-colors"
            >
              {panelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              <span className="text-xs font-medium">{panelOpen ? 'Hide Decorations' : 'Show Decorations'}</span>
            </button>

            {/* Decoration Panel */}
            <div className={`shrink-0 transition-all duration-300 overflow-hidden ${panelOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
              <DecorationPanel addDecoration={addDecoration} />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

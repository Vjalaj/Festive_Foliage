"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { ornaments, stickers, extras } from '@/lib/decorations';
import { DecorationItem } from './DecorationItem';
import { DecorationOption, Decoration } from '@/lib/types';
import { FileImage, Type, Sparkles, Gift, Star } from 'lucide-react';

interface DecorationPanelProps {
  addDecoration: (decoration: Omit<Decoration, 'id'>) => void;
}

export const DecorationPanel = ({ addDecoration }: DecorationPanelProps) => {
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('ornaments');
  const { toast } = useToast();

  // Generate random position within typical tree bounds
  const getRandomPosition = () => ({
    x: 100 + Math.random() * 220, // Random x between 100-320
    y: 100 + Math.random() * 350, // Random y between 100-450
  });

  const handleAddNameTag = () => {
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Name is empty', description: 'Please enter a name to create a tag.' });
      return;
    }
    const pos = getRandomPosition();
    addDecoration({
      type: 'text',
      name: 'text',
      x: pos.x,
      y: pos.y,
      scale: 1,
      rotation: -10,
      data: { text: name },
    });
    setName('');
    toast({ title: '🏷️ Name Tag Added!', description: 'Drag it onto the tree.' });
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'Image too large', description: 'Please upload an image smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const pos = getRandomPosition();
        addDecoration({
          type: 'image',
          name: 'image',
          x: pos.x,
          y: pos.y,
          scale: 1,
          rotation: 0,
          data: { src: imageUrl }
        });
        toast({ title: '📷 Image Added!', description: 'Drag your photo onto the tree.' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-black/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-4 rounded-none h-10 bg-white/5 p-0">
          <TabsTrigger 
            value="ornaments" 
            className="text-[11px] text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-none h-full gap-1"
          >
            <Star className="h-3 w-3" />
            Ornaments
          </TabsTrigger>
          <TabsTrigger 
            value="stickers" 
            className="text-[11px] text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-none h-full gap-1"
          >
            <Gift className="h-3 w-3" />
            Stickers
          </TabsTrigger>
          <TabsTrigger 
            value="extras" 
            className="text-[11px] text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-none h-full gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Extras
          </TabsTrigger>
          <TabsTrigger 
            value="custom" 
            className="text-[11px] text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-none h-full gap-1"
          >
            <Type className="h-3 w-3" />
            Custom
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="ornaments" className="p-2 mt-0">
            <div className="grid grid-cols-4 gap-2">
              {ornaments.map((item) => (
                <DecorationItem key={item.name} item={item} addDecoration={addDecoration} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stickers" className="p-2 mt-0">
            <div className="grid grid-cols-4 gap-2">
              {stickers.map((item) => (
                <DecorationItem key={item.name} item={item} addDecoration={addDecoration} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="extras" className="p-2 mt-0">
            <div className="grid grid-cols-4 gap-2">
              {extras.map((item) => (
                <DecorationItem key={item.name} item={item} addDecoration={addDecoration} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom" className="p-3 mt-0 space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/80 text-xs">
                <Type className="w-3.5 h-3.5" /> Add Your Name
              </Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNameTag()}
                />
                <Button onClick={handleAddNameTag} className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white text-sm">
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/80 text-xs">
                <FileImage className="w-3.5 h-3.5" /> Upload Your Photo
              </Label>
              <Input 
                type="file" 
                accept="image/png, image/jpeg, image/gif, image/webp" 
                onChange={handleImageUpload} 
                className="h-9 bg-white/10 border-white/20 text-white text-sm file:text-white file:bg-white/10 file:border-0 file:mr-2 file:px-3 file:py-1 file:rounded file:text-xs"
              />
              <p className="text-[10px] text-white/40">Max 2MB. Your photo will become a decoration!</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
};

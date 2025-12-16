"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { ornaments, stickers } from '@/lib/decorations.tsx';
import { DecorationItem } from './DecorationItem';
import { DecorationOption, Decoration } from '@/lib/types';
import { FileImage, Type } from 'lucide-react';

interface DecorationPanelProps {
  addDecoration: (decoration: Omit<Decoration, 'id'>) => void;
}

export const DecorationPanel = ({ addDecoration }: DecorationPanelProps) => {
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleAddNameTag = () => {
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Name is empty', description: 'Please enter a name to create a tag.' });
      return;
    }
    const textToAdd = name;
    addDecoration({
      type: 'text',
      component: () => <span className="text-background bg-primary/80 px-4 py-2 rounded-lg shadow-lg font-bold text-lg select-none">{textToAdd}</span>,
      x: 150,
      y: 150,
      scale: 1,
      rotation: -15,
      data: { text: textToAdd },
    });
    setName('');
     toast({ title: 'Name Tag Added!', description: 'Drag it to your desired spot on the tree.' });
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: 'destructive', title: 'Image too large', description: 'Please upload an image smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        addDecoration({
          type: 'image',
          component: ({ src }) => <img src={src} alt="user upload" className="w-16 h-16 rounded-full border-4 border-accent object-cover shadow-lg" />,
          x: 150,
          y: 200,
          scale: 1,
          rotation: 0,
          data: { src: imageUrl }
        });
        toast({ title: 'Image Added!', description: 'Drag your custom ornament onto the tree.' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/50 bg-background/80 backdrop-blur-sm z-10 flex flex-col h-full">
      <Tabs defaultValue="ornaments" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 rounded-none h-auto">
          <TabsTrigger value="ornaments">Ornaments</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="ornaments" className="p-4 mt-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
              {ornaments.map((item) => (
                <DecorationItem key={item.name} item={item} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stickers" className="p-4 mt-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
              {stickers.map((item) => (
                <DecorationItem key={item.name} item={item} />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
        
        <div className="p-4 border-t border-border/50 space-y-4 mt-auto">
            <div className="space-y-2">
                <Label htmlFor="name-tag" className="flex items-center gap-2"><Type className="w-4 h-4" /> Add a Name Tag</Label>
                <div className="flex gap-2">
                    <Input id="name-tag" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Button onClick={handleAddNameTag}>Add</Button>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="image-upload" className="flex items-center gap-2"><FileImage className="w-4 h-4" /> Upload an Image</Label>
                 <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} className="file:text-primary file:font-bold" />
            </div>
        </div>
      </Tabs>
    </aside>
  );
};

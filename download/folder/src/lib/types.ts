import type { ComponentType } from 'react';

export type DecorationType = 'ornament' | 'sticker' | 'light' | 'ribbon' | 'text' | 'image';

export interface Decoration {
  id: string;
  type: DecorationType;
  component: ComponentType<any>;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  data?: Record<string, any>; // For text content, image src, etc.
}

export interface DecorationOption {
  type: DecorationType;
  name: string;
  component: ComponentType<any>;
  defaultScale?: number;
}

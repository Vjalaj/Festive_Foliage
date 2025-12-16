import type { ComponentType } from 'react';

export type DecorationType = 'ornament' | 'sticker' | 'light' | 'ribbon' | 'text' | 'image';

export interface Decoration {
  id: string;
  type: DecorationType;
  // component may be provided at runtime; persisted decorations store `name` and `data`
  component?: ComponentType<any>;
  name?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  data?: Record<string, any>; // For text content, image src, etc.
  ip?: string;
  session?: string;
}

export interface DecorationOption {
  type: DecorationType;
  name: string;
  component: ComponentType<any>;
  defaultScale?: number;
}

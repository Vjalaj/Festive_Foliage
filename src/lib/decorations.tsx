import type { DecorationOption } from './types';
import { 
  Bauble, CandyCane, Snowflake, Star, GiftBox, Bell, 
  Ribbon, Gingerbread, Holly, Stocking, Candy, Glitter, 
  Wreath, Snowman, Angel, Ornament 
} from '@/components/festive/DecorationSVGs';

export const ornaments: DecorationOption[] = [
  { type: 'ornament', name: 'Red Bauble', component: () => <Bauble color="#E53935" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Gold Bauble', component: () => <Bauble color="#FFD700" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Blue Bauble', component: () => <Bauble color="#1976D2" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Green Bauble', component: () => <Bauble color="#388E3C" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Purple Bauble', component: () => <Bauble color="#7B1FA2" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Pink Bauble', component: () => <Bauble color="#E91E63" />, defaultScale: 0.9 },
  { type: 'ornament', name: 'Star', component: Star, defaultScale: 0.85 },
  { type: 'ornament', name: 'Bell', component: Bell, defaultScale: 0.8 },
  { type: 'ornament', name: 'Striped Ornament', component: () => <Ornament pattern="stripes" color="#1976D2" />, defaultScale: 0.85 },
  { type: 'ornament', name: 'Dotted Ornament', component: () => <Ornament pattern="dots" color="#7B1FA2" />, defaultScale: 0.85 },
  { type: 'ornament', name: 'Zigzag Ornament', component: () => <Ornament pattern="zigzag" color="#00897B" />, defaultScale: 0.85 },
];

export const stickers: DecorationOption[] = [
  { type: 'sticker', name: 'Candy Cane', component: CandyCane, defaultScale: 0.85 },
  { type: 'sticker', name: 'Snowflake', component: Snowflake, defaultScale: 0.9 },
  { type: 'sticker', name: 'Gift Box', component: GiftBox, defaultScale: 0.8 },
  { type: 'sticker', name: 'Gingerbread', component: Gingerbread, defaultScale: 0.85 },
  { type: 'sticker', name: 'Holly', component: Holly, defaultScale: 0.9 },
  { type: 'sticker', name: 'Stocking', component: Stocking, defaultScale: 0.8 },
  { type: 'sticker', name: 'Wreath', component: Wreath, defaultScale: 0.8 },
  { type: 'sticker', name: 'Snowman', component: Snowman, defaultScale: 0.75 },
  { type: 'sticker', name: 'Angel', component: Angel, defaultScale: 0.8 },
];

export const extras: DecorationOption[] = [
  { type: 'extra', name: 'Red Ribbon', component: () => <Ribbon color="#E53935" />, defaultScale: 0.85 },
  { type: 'extra', name: 'Gold Ribbon', component: () => <Ribbon color="#FFD700" />, defaultScale: 0.85 },
  { type: 'extra', name: 'Blue Ribbon', component: () => <Ribbon color="#1976D2" />, defaultScale: 0.85 },
  { type: 'extra', name: 'Red Candy', component: () => <Candy color="#E53935" />, defaultScale: 0.9 },
  { type: 'extra', name: 'Pink Candy', component: () => <Candy color="#E91E63" />, defaultScale: 0.9 },
  { type: 'extra', name: 'Green Candy', component: () => <Candy color="#4CAF50" />, defaultScale: 0.9 },
  { type: 'extra', name: 'Gold Glitter', component: () => <Glitter color="#FFD700" />, defaultScale: 1 },
  { type: 'extra', name: 'Silver Glitter', component: () => <Glitter color="#E0E0E0" />, defaultScale: 1 },
  { type: 'extra', name: 'Red Glitter', component: () => <Glitter color="#F44336" />, defaultScale: 1 },
];

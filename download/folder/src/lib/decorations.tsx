import type { DecorationOption } from './types';
import { Bauble, CandyCane, Snowflake, Star } from '@/components/festive/DecorationSVGs';

export const ornaments: DecorationOption[] = [
  { type: 'ornament', name: 'Red Bauble', component: () => <Bauble color="#C70039" /> },
  { type: 'ornament', name: 'Gold Bauble', component: () => <Bauble color="#FFC300" /> },
  { type: 'ornament', name: 'Blue Bauble', component: () => <Bauble color="#3498DB" /> },
  { type: 'ornament', name: 'Star Topper', component: Star, defaultScale: 1.5 },
];

export const stickers: DecorationOption[] = [
  { type: 'sticker', name: 'Candy Cane', component: CandyCane, defaultScale: 0.8 },
  { type: 'sticker', name: 'Snowflake', component: Snowflake, defaultScale: 0.7 },
];

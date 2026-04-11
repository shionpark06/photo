export type Plan = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
};

export type Location = {
  id: string;
  name: string;
  surcharge: number;
};

export type Addon = {
  id: string;
  name: string;
  price: number;
};

export const PLANS: Plan[] = [
  { id: 'quick', name: 'Seoul Quick Shot', price: 120, duration: 50, description: 'Perfect for solo travelers wanting quick, aesthetic memories.' },
  { id: 'fisheye', name: 'Fish-Eye Wanderer', price: 160, duration: 90, description: 'Creative, wide-angle shots capturing the vibrant city energy.' },
  { id: 'golden', name: 'Golden Hour Session', price: 200, duration: 120, description: 'Warm, cinematic portraits during sunset.' },
  { id: 'neon', name: 'Neon Nights', price: 180, duration: 90, description: 'Cyberpunk-inspired night photography in bustling districts.' },
  { id: 'full', name: 'Full Seoul Experience', price: 280, duration: 180, description: 'Comprehensive shoot across multiple locations.' },
];

export const LOCATIONS: Location[] = [
  { id: 'myeongdong', name: 'Myeongdong', surcharge: 0 },
  { id: 'hongdae', name: 'Hongdae', surcharge: 20 },
  { id: 'hanriver', name: 'Han River', surcharge: 30 },
  { id: 'bukchon', name: 'Bukchon Hanok Village', surcharge: 10 },
  { id: 'gangnam', name: 'Gangnam', surcharge: 20 },
];

export const ADDONS: Addon[] = [
  { id: 'express', name: 'Express Delivery (48h)', price: 40 },
  { id: 'retouch', name: 'Skin & Face Retouch', price: 50 },
];

export const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

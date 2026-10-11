import { BrandName } from '../types/product';

export interface BrandInfo {
  name: BrandName;
  tagline: string;
  phoneCount: number;
  badge: string;
  popularModel: string;
  accentBg: string;
}

export const BRANDS_DATA: BrandInfo[] = [
  {
    name: 'Apple',
    tagline: 'iPhone & iOS Innovation',
    phoneCount: 4,
    badge: 'Flagship & Pro',
    popularModel: 'iPhone 16 Pro Max',
    accentBg: 'bg-slate-900 text-white',
  },
  {
    name: 'Samsung',
    tagline: 'Galaxy AI & Foldables',
    phoneCount: 4,
    badge: 'Ultra & Z Fold',
    popularModel: 'Galaxy S25 Ultra',
    accentBg: 'bg-blue-700 text-white',
  },
  {
    name: 'Xiaomi',
    tagline: 'Leica Optics & Flagships',
    phoneCount: 3,
    badge: 'Pro Optics',
    popularModel: 'Xiaomi 14 Ultra',
    accentBg: 'bg-orange-600 text-white',
  },
  {
    name: 'Redmi',
    tagline: 'Performance for Everyone',
    phoneCount: 3,
    badge: 'Value Kings',
    popularModel: 'Redmi Note 14 Pro+',
    accentBg: 'bg-red-600 text-white',
  },
  {
    name: 'Motorola',
    tagline: 'Pure Android & Edge Razr',
    phoneCount: 3,
    badge: 'Razr & Edge',
    popularModel: 'Razr 50 Ultra',
    accentBg: 'bg-indigo-700 text-white',
  },
  {
    name: 'Tecno',
    tagline: 'Pioneering Camera Innovations',
    phoneCount: 3,
    badge: 'Camon & Phantom',
    popularModel: 'Phantom V Fold 2',
    accentBg: 'bg-sky-600 text-white',
  },
  {
    name: 'Infinix',
    tagline: 'Speed, Gaming & Style',
    phoneCount: 3,
    badge: 'GT Gaming Series',
    popularModel: 'Infinix GT 20 Pro',
    accentBg: 'bg-emerald-600 text-white',
  },
  {
    name: 'OPPO',
    tagline: 'Hasselblad Portrait Masters',
    phoneCount: 3,
    badge: 'Find & Reno Series',
    popularModel: 'Find X7 Ultra',
    accentBg: 'bg-teal-700 text-white',
  },
  {
    name: 'vivo',
    tagline: 'ZEISS Co-engineered Imaging',
    phoneCount: 3,
    badge: 'X Series & V Series',
    popularModel: 'vivo X100 Pro',
    accentBg: 'bg-blue-600 text-white',
  },
];

export type BrandName =
  | 'Apple'
  | 'Samsung'
  | 'Xiaomi'
  | 'Redmi'
  | 'Motorola'
  | 'Tecno'
  | 'Infinix'
  | 'OPPO'
  | 'vivo';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface ProductSpecs {
  display: string;
  processor: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  network: string;
  sim: string;
  weight: string;
  os: string;
  warranty: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: BrandName;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  ramOptions: string[];
  storageOptions: string[];
  availableColours: ProductColor[];
  operatingSystem: string;
  screenSize: string;
  batteryCapacity: string;
  cameraSpecification: string;
  processor: string;
  stockQuantity: number;
  releaseDate: string;
  category: 'flagship' | 'budget' | 'gaming' | 'foldable' | 'midrange';
  featured: boolean;
  bestSeller: boolean;
  isNewArrival?: boolean;
  specifications: ProductSpecs;
  reviews: Review[];
}

export interface CartItem {
  id: string; // unique combo of product id + color + storage + ram
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedStorage: string;
  selectedRam: string;
  unitPrice: number;
  quantity: number;
}

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'discount-desc';

export interface FilterState {
  searchQuery: string;
  brands: BrandName[];
  minPrice: number;
  maxPrice: number;
  ram: string[];
  storage: string[];
  operatingSystem: string[];
  screenSize: string[];
  minRating: number;
  minDiscount: number;
  inStockOnly: boolean;
  category: string;
  sortBy: SortOption;
}

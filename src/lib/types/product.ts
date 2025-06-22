// lib/types/product.ts
export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string | null;
  images: string[] | null;
  price: string; // decimal stored as string
  game: string | null;
  category: string | null;
  status: string;
  views: number | null;
  likes: number | null;
  sales: number | null;
  revenue: number | null; // decimal stored as string
  tags: string[] | null;
  video_url: string | null;
  featured: boolean | null;
  rating: string | null; // decimal stored as string
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UserStats {
  totalProducts: number;
  totalViews: number;
  totalLikes: number;
  totalSales: number;
  totalRevenue: number;
}

export type Product = {
  image: string;
  thumbnail: any;
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  likes: number;
  views: number;
  tags: string[];
  rating: number;
  featured: boolean;
  uploadedAt: string;
};

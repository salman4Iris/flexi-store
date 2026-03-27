export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  alt?: string;
  originalPrice?: number;
  discount?: number;
  currency?: string;
};

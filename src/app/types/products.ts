import { Review } from './review';
export interface Product {
  category: string;
  currency: string;
  description: string;
  price: number;
  docId: string;
  id: string;
  rating: number;
  reviews: Array<Review>;
  title: string;
  title_arr: Array<string>;
  subtitle: string;
  sizes: Array<string | number | null>;
  amount?: number;
  size?: string | null;
  imagesUrls: Array<string>;
  color: { type: string; name: string; hex: string | number };
  colors: Array<object>;
  typeModel: string;
}

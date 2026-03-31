export type Product = {
  id: string;
  name: string;
  description: Record<string, string | number | boolean | null>; // JSONB structured data
  price: number | null;
  is_active: boolean;
  category_id: number;
  created_at: string;
  updated_at?: string;
  categories?: {
    name: string;
  } | null;
  covers?: {
    url: string;
    order: number;
  }[];
};

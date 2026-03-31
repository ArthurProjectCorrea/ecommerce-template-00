export type Category = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  products_count?: number;
  template_fields?: string[];
};

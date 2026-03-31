-- Add price and is_active columns to products
ALTER TABLE products ADD COLUMN price numeric;
ALTER TABLE products ADD COLUMN is_active boolean NOT NULL DEFAULT true;

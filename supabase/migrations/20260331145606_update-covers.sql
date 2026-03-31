-- Update covers table to add 'order' column
ALTER TABLE covers ADD COLUMN "order" integer NOT NULL DEFAULT 1;

-- If you have multiple images for the same product, you may want to ensure unique order per product
-- However, for the current requirement, we'll just use 'order' to filter.

CREATE INDEX idx_covers_product_order ON covers(products_id, "order");

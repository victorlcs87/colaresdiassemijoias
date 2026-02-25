-- Add condition column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS condition text DEFAULT 'novo';

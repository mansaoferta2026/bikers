-- Add social media links to events table
ALTER TABLE public.events ADD COLUMN instagram_url text;
ALTER TABLE public.events ADD COLUMN tiktok_url text;

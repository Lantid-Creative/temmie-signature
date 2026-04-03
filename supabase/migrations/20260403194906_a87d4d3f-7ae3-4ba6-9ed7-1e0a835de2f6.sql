-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to site-assets
CREATE POLICY "Public read access for site-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

-- Allow admin upload to site-assets
CREATE POLICY "Admin upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets' AND (SELECT is_admin()));

-- Allow admin update in site-assets
CREATE POLICY "Admin update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets' AND (SELECT is_admin()));

-- Allow admin delete from site-assets
CREATE POLICY "Admin delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets' AND (SELECT is_admin()));
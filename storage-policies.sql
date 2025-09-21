-- Storage bucket policies for urlshort-userprofile
-- OPTION 1: Use Supabase Dashboard (Recommended)
-- Go to Storage > Policies in your Supabase Dashboard
-- Create the following policies for the 'urlshort-userprofile' bucket:

-- Policy 1: Allow users to upload their own profile pictures
-- Name: Users can upload their own profile pictures
-- Allowed operation: INSERT
-- Target roles: authenticated
-- USING expression: (storage.filename(name) LIKE (auth.uid()::text || '%'))

-- Policy 2: Allow users to update their own profile pictures
-- Name: Users can update their own profile pictures
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- USING expression: (storage.filename(name) LIKE (auth.uid()::text || '%'))

-- Policy 3: Allow users to delete their own profile pictures
-- Name: Users can delete their own profile pictures
-- Allowed operation: DELETE
-- Target roles: authenticated
-- USING expression: (storage.filename(name) LIKE (auth.uid()::text || '%'))

-- Policy 4: Allow public read access to profile pictures
-- Name: Anyone can view profile pictures
-- Allowed operation: SELECT
-- Target roles: public
-- USING expression: true

-- OPTION 2: SQL Commands (if dashboard doesn't work)
-- First, make sure the bucket exists and RLS is enabled
-- You may need to run these in the Supabase SQL editor:

-- Create storage bucket (if it doesn't exist)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('urlshort-userprofile', 'urlshort-userprofile', true);

-- Enable RLS on storage.objects
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies on storage.objects table
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'urlshort-userprofile' AND
  auth.role() = 'authenticated' AND
  (storage.filename(name) LIKE (auth.uid()::text || '%'))
);

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'urlshort-userprofile' AND
  auth.role() = 'authenticated' AND
  (storage.filename(name) LIKE (auth.uid()::text || '%'))
);

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'urlshort-userprofile' AND
  auth.role() = 'authenticated' AND
  (storage.filename(name) LIKE (auth.uid()::text || '%'))
);

CREATE POLICY "Anyone can view profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'urlshort-userprofile');
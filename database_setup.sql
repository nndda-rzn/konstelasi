-- =========================================================================
-- VISUAL NODE-BASED DIARY - SUPABASE SETUP SCRIPT
-- Copy & Paste this script into your Supabase SQL Editor and run it.
-- =========================================================================

-- 1. Create a Trigger to sync Supabase Auth (auth.users) to our local User (public.user) table
-- Note: Make sure you have run `npx mikro-orm schema:create --run` inside the 
-- backend folder FIRST so that `public.user` table exists!

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."user" (id, email, created_at)
  VALUES (new.id, new.email, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create the Storage Bucket for note images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notes_images', 'notes_images', true) 
ON CONFLICT (id) DO NOTHING;

-- 3. Set RLS (Row Level Security) Policies on the Bucket 
-- Allows reading for anyone, uploading for logged in users, and deleting for the uploader
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'notes_images' );

CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'notes_images' AND auth.role() = 'authenticated' );

CREATE POLICY "Owner Deletion" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'notes_images' AND auth.uid() = owner);

-- =========================================================================
-- END OF SCRIPT
-- =========================================================================

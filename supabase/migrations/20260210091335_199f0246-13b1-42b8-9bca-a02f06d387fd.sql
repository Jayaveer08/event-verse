
-- Allow authenticated users to insert events
CREATE POLICY "Authenticated users can create events"
ON public.events
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to update their own events (we'll track creator)
-- First add a created_by column
ALTER TABLE public.events ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Allow creators to update their own events
CREATE POLICY "Creators can update own events"
ON public.events
FOR UPDATE
USING (auth.uid() = created_by);

-- Allow creators to delete their own events
CREATE POLICY "Creators can delete own events"
ON public.events
FOR DELETE
USING (auth.uid() = created_by);

-- Allow authenticated users to insert venues
CREATE POLICY "Authenticated users can create venues"
ON public.venues
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own event images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

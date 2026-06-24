
-- Fix overly permissive INSERT policy on events
DROP POLICY "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events"
ON public.events
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Fix overly permissive INSERT policy on venues
DROP POLICY "Authenticated users can create venues" ON public.venues;
CREATE POLICY "Authenticated users can create venues"
ON public.venues
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

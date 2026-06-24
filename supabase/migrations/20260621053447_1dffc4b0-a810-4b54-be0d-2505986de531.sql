
-- 1. Lock down SECURITY DEFINER trigger functions: they should only be called by triggers, not via the API
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_event_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 2. Hide auth-only tables from anon (GraphQL/PostgREST discovery)
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.bookings FROM anon;
REVOKE SELECT ON public.favorites FROM anon;
REVOKE SELECT ON public.linked_accounts FROM anon;

-- 3. Prevent listing of event-images bucket. Public URLs still work because the bucket is public;
-- only the storage list/select API is restricted.
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;

-- 4. Fix event-images INSERT: enforce that path's first folder == uploader's user id
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
CREATE POLICY "Users can upload event images to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 5. Roles infrastructure + admin-only venue inserts
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Replace open INSERT on venues with admin-only
DROP POLICY IF EXISTS "Authenticated users can create venues" ON public.venues;
CREATE POLICY "Admins can create venues"
ON public.venues FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update venues"
ON public.venues FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete venues"
ON public.venues FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

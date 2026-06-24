
-- Linked accounts table
CREATE TABLE public.linked_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_user_id UUID NOT NULL,
  linked_user_id UUID NOT NULL,
  linked_email TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (primary_user_id, linked_email),
  UNIQUE (linked_user_id)
);

CREATE INDEX idx_linked_accounts_primary ON public.linked_accounts(primary_user_id);
CREATE INDEX idx_linked_accounts_linked ON public.linked_accounts(linked_user_id);

ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own linked accounts"
  ON public.linked_accounts FOR SELECT
  USING (auth.uid() = primary_user_id OR auth.uid() = linked_user_id);

CREATE POLICY "Users can create their own linked accounts"
  ON public.linked_accounts FOR INSERT
  WITH CHECK (auth.uid() = primary_user_id OR auth.uid() = linked_user_id);

CREATE POLICY "Users can delete their own linked accounts"
  ON public.linked_accounts FOR DELETE
  USING (auth.uid() = primary_user_id OR auth.uid() = linked_user_id);

-- Updated handle_new_user that auto-links by matching email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  existing_primary UUID;
  new_email TEXT;
  new_full_name TEXT;
  new_avatar TEXT;
BEGIN
  new_email := NEW.email;
  new_full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    NEW.email
  );
  new_avatar := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture'
  );

  -- Look for an existing profile with the same email but a different id
  SELECT id INTO existing_primary
  FROM public.profiles
  WHERE email = new_email AND id <> NEW.id
  LIMIT 1;

  -- If found, also check linked_accounts to climb to the original primary
  IF existing_primary IS NOT NULL THEN
    DECLARE
      climbed UUID;
    BEGIN
      SELECT primary_user_id INTO climbed
      FROM public.linked_accounts
      WHERE linked_user_id = existing_primary
      LIMIT 1;
      IF climbed IS NOT NULL THEN
        existing_primary := climbed;
      END IF;
    END;

    -- Record the link (idempotent)
    INSERT INTO public.linked_accounts (primary_user_id, linked_user_id, linked_email, provider)
    VALUES (existing_primary, NEW.id, new_email, COALESCE(NEW.raw_app_meta_data ->> 'provider', 'google'))
    ON CONFLICT (linked_user_id) DO NOTHING;
  END IF;

  -- Always create/refresh a profile for the new auth user
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, new_email, new_full_name, new_avatar)
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  module_number INTEGER NOT NULL DEFAULT 1,
  class_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'class_sessions'
      AND policyname = 'Class sessions are viewable by everyone'
  ) THEN
    CREATE POLICY "Class sessions are viewable by everyone"
    ON public.class_sessions FOR SELECT TO public
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'class_sessions'
      AND policyname = 'Admins can manage class sessions'
  ) THEN
    CREATE POLICY "Admins can manage class sessions"
    ON public.class_sessions FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_class_sessions_updated_at ON public.class_sessions;
CREATE TRIGGER update_class_sessions_updated_at
BEFORE UPDATE ON public.class_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.class_registrations
ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.class_sessions(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'class_registrations'
      AND policyname = 'Admins can view class registrations'
  ) THEN
    CREATE POLICY "Admins can view class registrations"
    ON public.class_registrations FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

INSERT INTO public.class_sessions (title, module_number, class_date, location, max_capacity, is_active)
SELECT name, 1, start_date, location, max_capacity, is_active
FROM public.cohorts
WHERE NOT EXISTS (SELECT 1 FROM public.class_sessions);

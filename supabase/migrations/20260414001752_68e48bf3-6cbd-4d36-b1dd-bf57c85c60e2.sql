
-- Create cohorts table
CREATE TABLE public.cohorts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL DEFAULT 'Montevideo, Centro',
  max_capacity INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

-- Everyone can view cohorts
CREATE POLICY "Cohorts are viewable by everyone"
ON public.cohorts FOR SELECT TO public
USING (true);

-- Only admins can manage cohorts
CREATE POLICY "Admins can manage cohorts"
ON public.cohorts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE TRIGGER update_cohorts_updated_at
BEFORE UPDATE ON public.cohorts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime on profiles for live counter
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Insert placeholder cohort 30 days from now
INSERT INTO public.cohorts (name, start_date, location, max_capacity, is_active)
VALUES ('Cohorte 1 — 2026', now() + interval '30 days', 'Montevideo, Centro', 25, true);

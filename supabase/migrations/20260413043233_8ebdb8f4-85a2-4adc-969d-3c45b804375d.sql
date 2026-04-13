
ALTER TABLE public.profiles
  ADD COLUMN full_name TEXT,
  ADD COLUMN age_range TEXT,
  ADD COLUMN department TEXT,
  ADD COLUMN institution TEXT,
  ADD COLUMN how_found_us TEXT,
  ADD COLUMN interests TEXT[],
  ADD COLUMN accepted_terms BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT false;

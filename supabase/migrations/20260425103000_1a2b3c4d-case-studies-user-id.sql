ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

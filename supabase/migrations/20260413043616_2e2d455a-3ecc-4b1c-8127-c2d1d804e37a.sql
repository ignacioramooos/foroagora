
-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  speaker_name TEXT,
  speaker_role TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  spots_total INTEGER NOT NULL DEFAULT 30,
  spots_taken INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT USING (true);

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
ON public.event_registrations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from events"
ON public.event_registrations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Seed some sample events
INSERT INTO public.events (title, description, speaker_name, speaker_role, event_date, location, spots_total, spots_taken) VALUES
('Clase Magistral: Análisis de Apple', 'Analizamos en profundidad el modelo de negocio de Apple, sus ventajas competitivas y cómo valuar la empresa usando métricas fundamentales. Ideal para quienes quieren entender cómo piensan los grandes inversores.', 'Nico', 'Analista Senior', now() + interval '10 days', 'Sede INJU', 30, 22),
('Workshop: Tu Primer DCF', 'Taller práctico donde vas a construir tu primer modelo de Discounted Cash Flow paso a paso. Traé tu notebook y muchas ganas de aprender.', 'Valentina R.', 'Mentora Foro Agora', now() + interval '17 days', 'Sede INJU', 25, 8),
('Charla Abierta: Invertir desde Uruguay', '¿Cómo abrís una cuenta de broker? ¿Qué impuestos pagás? Respondemos las preguntas más comunes sobre invertir siendo residente uruguayo.', 'Martín G.', 'Co-fundador Foro Agora', now() + interval '25 days', 'Online (Zoom)', 100, 45),
('Análisis Fundamental — Clase 3', 'Tercera clase del módulo de Análisis Fundamental. Cubrimos estados de resultados, márgenes y cómo interpretar la rentabilidad operativa.', 'Nico', 'Analista Senior', now() + interval '5 days', 'Sede INJU', 30, 28);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

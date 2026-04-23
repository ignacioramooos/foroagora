CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'analysis')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts are publicly readable"
ON public.community_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Admin insert community posts"
ON public.community_posts FOR INSERT
WITH CHECK (true);

INSERT INTO public.community_posts (title, author, type) VALUES
('¡Bienvenidos a la primera cohorte de InvertíUY!', 'Equipo InvertíUY', 'announcement'),
('Análisis de MercadoLibre (MELI) — por Nicolás', 'Nicolás Sales', 'analysis'),
('Próxima clase: Cash Flow Statement', 'Equipo InvertíUY', 'announcement'),
('Mi tesis sobre Apple — ratio P/E y FCF', 'Estudiante', 'analysis'),
('Nuevo material: guía de valoración por múltiplos', 'Equipo InvertíUY', 'announcement');

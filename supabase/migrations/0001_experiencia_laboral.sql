CREATE TABLE IF NOT EXISTS public.experiencia_laboral (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_egresado UUID NOT NULL REFERENCES public.egresado(id) ON DELETE CASCADE,
  empresa VARCHAR(150) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  tipo_empleo VARCHAR(50) NOT NULL DEFAULT 'No especificado',
  descripcion TEXT NOT NULL DEFAULT '',
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.experiencia_laboral
  ADD COLUMN IF NOT EXISTS tipo_empleo VARCHAR(50) NOT NULL DEFAULT 'No especificado',
  ADD COLUMN IF NOT EXISTS descripcion TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS experiencia_laboral_egresado_fecha_idx
  ON public.experiencia_laboral (id_egresado, fecha_inicio DESC);

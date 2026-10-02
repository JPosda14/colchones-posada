-- 004: Tabla cotizaciones + políticas

create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  municipio text not null,
  telefono text not null,
  producto_interes text not null,
  medida_interes text,
  comentario text,
  canal text,
  estado text not null default 'nueva',
  created_at timestamptz not null default now()
);

alter table public.cotizaciones enable row level security;

-- El formulario público inserta con la anon key.
create policy cotizaciones_insert_anon
  on public.cotizaciones for insert
  to anon
  with check (true);

-- Lectura/actualización de cotizaciones solo para el admin.
create policy cotizaciones_admin_all
  on public.cotizaciones for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');
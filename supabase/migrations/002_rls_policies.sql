-- RLS: el sitio público lee el catálogo con la clave anónima.
-- El panel admin escribe con la service_role key (omite RLS) y nunca se expone al cliente.

alter table productos enable row level security;
alter table producto_medidas enable row level security;
alter table producto_imagenes enable row level security;
alter table cotizaciones enable row level security;

-- Catálogo público: lectura abierta (anon) para render del sitio
create policy "public read productos"
  on productos for select to anon
  using (true);

create policy "public read producto_medidas"
  on producto_medidas for select to anon
  using (true);

create policy "public read producto_imagenes"
  on producto_imagenes for select to anon
  using (true);

-- Leads del formulario: el sitio inserta con clave anónima.
-- La lectura de cotizaciones queda reservada a service_role (sin policy para anon).
create policy "public insert cotizaciones"
  on cotizaciones for insert to anon
  with check (true);
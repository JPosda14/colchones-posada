-- 003: productos.garantia + updated_at, RLS refinado (solo activos), rol admin, bucket Storage

-- 1) Nuevas columnas en productos
alter table productos add column if not exists garantia text;
alter table productos add column if not exists updated_at timestamptz default now();

-- 2) Trigger para mantener updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_productos_updated_at on productos;
create trigger trg_productos_updated_at
  before update on productos
  for each row execute function public.set_updated_at();

-- 3) RLS: el sitio público solo lee productos activos (y sus medidas/imágenes)
drop policy if exists "public read productos" on productos;
create policy "public read productos"
  on productos for select to anon
  using (activo = true);

drop policy if exists "public read producto_medidas" on producto_medidas;
create policy "public read producto_medidas"
  on producto_medidas for select to anon
  using (exists (select 1 from productos p where p.id = producto_id and p.activo = true));

drop policy if exists "public read producto_imagenes" on producto_imagenes;
create policy "public read producto_imagenes"
  on producto_imagenes for select to anon
  using (exists (select 1 from productos p where p.id = producto_id and p.activo = true));

-- 4) Helper de rol admin (app_metadata.role = 'admin')
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin';
$$;

-- Escritura en el catálogo: solo rol admin
create policy "admin insert productos"
  on productos for insert to authenticated
  with check (public.is_admin());

create policy "admin update productos"
  on productos for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin delete productos"
  on productos for delete to authenticated
  using (public.is_admin());

create policy "admin insert producto_medidas"
  on producto_medidas for insert to authenticated
  with check (public.is_admin());

create policy "admin update producto_medidas"
  on producto_medidas for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin delete producto_medidas"
  on producto_medidas for delete to authenticated
  using (public.is_admin());

create policy "admin insert producto_imagenes"
  on producto_imagenes for insert to authenticated
  with check (public.is_admin());

create policy "admin update producto_imagenes"
  on producto_imagenes for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin delete producto_imagenes"
  on producto_imagenes for delete to authenticated
  using (public.is_admin());

-- Cotizaciones: lectura y gestión solo admin (el insert anónimo sigue permitido por la policy 002)
create policy "admin read cotizaciones"
  on cotizaciones for select to authenticated
  using (public.is_admin());

create policy "admin update cotizaciones"
  on cotizaciones for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin delete cotizaciones"
  on cotizaciones for delete to authenticated
  using (public.is_admin());

-- 5) Bucket público "productos" y permisos
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "public read productos storage"
  on storage.objects for select to anon
  using (bucket_id = 'productos');

create policy "admin write productos storage"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'productos' and public.is_admin());

create policy "admin update productos storage"
  on storage.objects for update to authenticated
  using (bucket_id = 'productos' and public.is_admin());

create policy "admin delete productos storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'productos' and public.is_admin());
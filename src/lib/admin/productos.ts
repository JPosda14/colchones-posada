import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { MedidaFormData, ImagenFormData } from "@/lib/validations";

export type AdminProductoRow = {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  activo: boolean;
  orden: number;
  badge: string | null;
  firmeza: number | null;
  updated_at: string | null;
  _medidas: number;
  _imagenes: number;
  _portada: string | null;
};

type FilaProducto = {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  activo: boolean;
  orden: number;
  badge: string | null;
  firmeza: number | null;
  updated_at: string | null;
  producto_medidas: Array<{ id: string }>;
  producto_imagenes: Array<{ url: string; orden: number }>;
};

export async function listProductosAdmin(): Promise<AdminProductoRow[]> {
  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("productos")
    .select(
      "id, nombre, slug, categoria, activo, orden, badge, firmeza, updated_at, producto_medidas(id), producto_imagenes(url, orden)"
    )
    .order("orden", { ascending: true });

  if (error) throw new Error(`Error al consultar productos: ${error.message}`);

  return (data ?? []).map((fila) => mapFila(fila as unknown as FilaProducto));
}

function mapFila(f: FilaProducto): AdminProductoRow {
  const medidas = f.producto_medidas ?? [];
  const imagenes = f.producto_imagenes ?? [];
  const portada = [...imagenes].sort((a, b) => a.orden - b.orden)[0]?.url ?? null;
  return {
    id: f.id,
    nombre: f.nombre,
    slug: f.slug,
    categoria: f.categoria,
    activo: f.activo,
    orden: f.orden,
    badge: f.badge,
    firmeza: f.firmeza,
    updated_at: f.updated_at,
    _medidas: medidas.length,
    _imagenes: imagenes.length,
    _portada: portada,
  };
}

export type ProductoEdicion = {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion: string | null;
  materiales: string | null;
  firmeza: number | null;
  badge: string | null;
  activo: boolean;
  orden: number;
  garantia: string | null;
  medidas: MedidaFormData[];
  imagenes: ImagenFormData[];
};

export async function getProductoParaEditar(
  slug: string
): Promise<ProductoEdicion | null> {
  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("productos")
    .select("*, producto_medidas(*), producto_imagenes(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Error al cargar el producto: ${error.message}`);
  if (!data) return null;

  const medidas: MedidaFormData[] = (
    (data.producto_medidas ?? []) as Array<Record<string, unknown>>
  ).map(
    (m: Record<string, unknown>) => ({
      medida: m.medida as string,
      dimensiones: (m.dimensiones as string) ?? "",
      precio_normal: m.precio_normal as number,
      precio_rebajado: (m.precio_rebajado as number) ?? null,
      disponible: (m.disponible as boolean) ?? true,
    })
  );
  const imagenes: ImagenFormData[] = (
    (data.producto_imagenes ?? []) as Array<Record<string, unknown>>
  ).map(
    (i: Record<string, unknown>) => ({
      url: i.url as string,
      tipo: (i.tipo as ImagenFormData["tipo"]) ?? "frontal",
      orden: (i.orden as number) ?? 0,
      alt: (i.alt as string) ?? "",
    })
  );
  imagenes.sort((a, b) => a.orden - b.orden);

  return {
    id: data.id as string,
    nombre: data.nombre as string,
    slug: data.slug as string,
    categoria: data.categoria as string,
    descripcion: data.descripcion as string,
    materiales: data.materiales as string,
    firmeza: data.firmeza as number,
    badge: data.badge as string,
    activo: (data.activo as boolean) ?? true,
    orden: (data.orden as number) ?? 0,
    garantia: data.garantia as string,
    medidas,
    imagenes,
  };
}
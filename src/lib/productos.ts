import { supabase } from "@/lib/supabase";
import type {
  Producto,
  ProductoImagen,
  ProductoMedida,
} from "@/types";

type FilaProducto = Record<string, unknown> & {
  producto_medidas?: unknown[] | null;
  producto_imagenes?: unknown[] | null;
};

const COLUMNAS =
  "id, nombre, slug, categoria, descripcion, materiales, firmeza, badge, activo, orden, created_at, producto_medidas(*), producto_imagenes(*)";

function mapMedida(m: Record<string, unknown>): ProductoMedida {
  return {
    id: String(m.id),
    producto_id: String(m.producto_id),
    medida: String(m.medida),
    dimensiones: (m.dimensiones as string) ?? null,
    precio_normal: m.precio_normal as number,
    precio_rebajado: (m.precio_rebajado as number) ?? null,
    disponible: (m.disponible as boolean) ?? true,
  };
}

function mapImagen(i: Record<string, unknown>): ProductoImagen {
  return {
    id: String(i.id),
    producto_id: String(i.producto_id),
    url: String(i.url),
    tipo: (i.tipo as ProductoImagen["tipo"]) ?? "frontal",
    orden: (i.orden as number) ?? 0,
    alt: (i.alt as string) ?? null,
  };
}

function mapProducto(f: FilaProducto): Producto {
  return {
    id: String(f.id),
    nombre: String(f.nombre),
    slug: String(f.slug),
    categoria: f.categoria as Producto["categoria"],
    descripcion: (f.descripcion as string) ?? null,
    materiales: (f.materiales as string) ?? null,
    firmeza: (f.firmeza as number) ?? null,
    badge: (f.badge as Producto["badge"]) ?? null,
    activo: (f.activo as boolean) ?? true,
    orden: (f.orden as number) ?? 0,
    created_at: (f.created_at as string) ?? new Date().toISOString(),
    medidas: ((f.producto_medidas as unknown[]) ?? []).map(
      (m) => mapMedida(m as Record<string, unknown>)
    ),
    imagenes: ((f.producto_imagenes as unknown[]) ?? []).map(
      (i) => mapImagen(i as Record<string, unknown>)
    ),
  };
}

export async function getProductosPublicos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(COLUMNAS)
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error("No se pudo cargar el catálogo");
  return (data ?? []).map((f) => mapProducto(f as FilaProducto));
}

export async function getProductoPublico(
  slug: string
): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(COLUMNAS)
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) throw new Error("No se pudo cargar el producto");
  return data ? mapProducto(data as FilaProducto) : null;
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CO")}`;
}
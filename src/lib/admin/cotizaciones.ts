import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type {
  CotizacionFila,
  EstadoCotizacion,
} from "@/lib/cotizaciones";

function mapFila(f: Record<string, unknown>): CotizacionFila {
  return {
    id: String(f.id),
    nombre: String(f.nombre),
    municipio: String(f.municipio),
    telefono: String(f.telefono),
    producto_interes: String(f.producto_interes),
    medida_interes: (f.medida_interes as string) ?? null,
    comentario: (f.comentario as string) ?? null,
    canal: (f.canal as string) ?? null,
    estado: (f.estado as EstadoCotizacion) ?? "nueva",
    createdAt: String(f.created_at),
  };
}

export async function listCotizaciones(): Promise<CotizacionFila[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("cotizaciones")
    .select(
      "id, nombre, municipio, telefono, producto_interes, medida_interes, comentario, canal, estado, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error("No se pudieron cargar las cotizaciones");
  return (data ?? []).map((f) => mapFila(f as Record<string, unknown>));
}
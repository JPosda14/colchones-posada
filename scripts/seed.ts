import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envFile = path.resolve(__dirname, "..", ".env.local");
  if (!existsSync(envFile)) return;
  const lines = readFileSync(envFile, "utf8").split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const ep = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ep || !key) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (en el entorno o .env.local)."
  );
  process.exit(1);
}

const admin = createClient(ep, key, { auth: { persistSession: false } });

async function main() {
  const data = JSON.parse(
    readFileSync(path.join(__dirname, "seed-data", "productos.json"), "utf8")
  ) as Array<{
  nombre: string;
  slug: string;
  categoria: string;
  descripcion: string | null;
  materiales: string | null;
  firmeza: number | null;
  badge: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
  medidas: Array<{
    medida: string;
    dimensiones: string | null;
    precio_normal: number;
    precio_rebajado: number | null;
    disponible: boolean;
  }>;
  imagenes: Array<{
    url: string;
    tipo: string;
    orden: number;
    alt: string | null;
  }>;
}>;

let creados = 0;
let actualizados = 0;

for (const p of data) {
  const campos = {
    nombre: p.nombre,
    slug: p.slug,
    categoria: p.categoria,
    descripcion: p.descripcion,
    materiales: p.materiales,
    firmeza: p.firmeza,
    badge: p.badge,
    activo: p.activo,
    orden: p.orden,
    created_at: p.created_at,
  };

  const { data: existente } = await admin
    .from("productos")
    .select("id")
    .eq("slug", p.slug)
    .maybeSingle();

  let productoId: string;
  if (existente) {
    const { error } = await admin
      .from("productos")
      .update(campos)
      .eq("id", existente.id);
    if (error) throw error;
    await admin
      .from("producto_medidas")
      .delete()
      .eq("producto_id", existente.id);
    await admin
      .from("producto_imagenes")
      .delete()
      .eq("producto_id", existente.id);
    productoId = existente.id as string;
    actualizados++;
  } else {
    const { data: insertado, error } = await admin
      .from("productos")
      .insert(campos)
      .select("id")
      .single();
    if (error) throw error;
    productoId = insertado.id as string;
    creados++;
  }

  const medidas = (p.medidas || []).map((m) => ({
    producto_id: productoId,
    medida: m.medida,
    dimensiones: m.dimensiones,
    precio_normal: m.precio_normal,
    precio_rebajado: m.precio_rebajado,
    disponible: m.disponible,
  }));
  if (medidas.length) {
    const { error } = await admin.from("producto_medidas").insert(medidas);
    if (error) throw error;
  }

  const imagenes = (p.imagenes || []).map((i) => ({
    producto_id: productoId,
    url: i.url,
    tipo: i.tipo,
    orden: i.orden,
    alt: i.alt,
  }));
  if (imagenes.length) {
    const { error } = await admin.from("producto_imagenes").insert(imagenes);
    if (error) throw error;
  }

  console.log(
    `  ${p.slug} -> medidas: ${medidas.length}, imagenes: ${imagenes.length}`
  );
}

console.log(`\nSeed completado: ${creados} creados, ${actualizados} actualizados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
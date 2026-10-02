"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isEmailAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { productoSchema, ProductoFormData } from "@/lib/validations";
import { slugify } from "@/lib/slug";
import { ESTADOS_COTIZACION } from "@/lib/cotizaciones";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isEmailAdmin(user.email)) {
    throw new Error("No autorizado");
  }

  return user;
}

export async function deleteProducto(slug: string) {
  await requireAdmin();

  const admin = getSupabaseAdmin();

  const { data: producto } = await admin
    .from("productos")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!producto) return;

  // Borrar de Storage las imágenes subidas bajo productos/{slug}/ (best-effort).
  const { data: imagenes } = await admin
    .from("producto_imagenes")
    .select("url")
    .eq("producto_id", producto.id);

  const pathsStorage: string[] = [];
  for (const img of imagenes ?? []) {
    const marca = "/storage/v1/object/public/productos/";
    const idx = img.url.indexOf(marca);
    if (idx !== -1) {
      const path = img.url.slice(idx + marca.length);
      if (path) pathsStorage.push(path);
    }
  }
  if (pathsStorage.length) {
    await admin.storage.from("productos").remove(pathsStorage);
  }

  const { error } = await admin.from("productos").delete().eq("slug", slug);
  if (error) throw new Error(`No se pudo eliminar el producto: ${error.message}`);

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/sitemap.xml");
}

const MARCA_STORAGE = "/storage/v1/object/public/productos/";

function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(MARCA_STORAGE);
  return idx === -1 ? null : url.slice(idx + MARCA_STORAGE.length);
}

function publicUrlDe(path: string): string {
  return getSupabaseAdmin()
    .storage.from("productos")
    .getPublicUrl(path).data.publicUrl;
}

export async function saveProducto(
  datos: ProductoFormData & { id?: string }
): Promise<{ slug: string }> {
  await requireAdmin();

  const idProducto = datos.id;

  const parsed = productoSchema.safeParse(datos);
  if (!parsed.success) {
    const primero =
      parsed.error.issues[0]?.message ?? "Los datos no son válidos";
    throw new Error(primero);
  }

  const d = parsed.data;
  if (d.categoria !== "colchon") d.firmeza = null;

  const slugFinal = slugify(d.slug);
  if (!slugFinal) throw new Error("El slug no puede ir vacío");

  const admin = getSupabaseAdmin();

  // Mover a la ruta definitiva las imágenes subidas bajo otro slug.
  for (const img of d.imagenes) {
    const path = storagePathFromUrl(img.url);
    if (!path) continue;
    const slugActual = path.split("/")[0];
    if (slugActual && slugActual !== slugFinal) {
      const archivo = path.slice(slugActual.length + 1);
      const nuevaPath = `${slugFinal}/${archivo}`;
      const { error: cpy } = await admin.storage.from("productos").copy(path, nuevaPath);
      if (!cpy) {
        await admin.storage.from("productos").remove([path]);
        img.url = publicUrlDe(nuevaPath);
      }
    }
  }

  // Unique slug (excepto el propio producto en edición).
  const slugQ = admin
    .from("productos")
    .select("id")
    .eq("slug", slugFinal);
  if (idProducto) slugQ.neq("id", idProducto);
  const { data: conSlug } = await slugQ.maybeSingle();
  if (conSlug) throw new Error("Ya existe un producto con ese slug");

  let productoId: string;

  if (idProducto) {
    const { error: eU } = await admin
      .from("productos")
      .update({
        nombre: d.nombre,
        slug: slugFinal,
        categoria: d.categoria,
        descripcion: d.descripcion || null,
        materiales: d.materiales || null,
        firmeza: d.firmeza,
        badge: d.badge || null,
        activo: d.activo,
        orden: d.orden,
        garantia: d.garantia || null,
      })
      .eq("id", idProducto);
    if (eU) throw new Error(`No se pudo guardar el producto: ${eU.message}`);
    productoId = idProducto;
  } else {
    const { data: nuevo, error: eI } = await admin
      .from("productos")
      .insert({
        nombre: d.nombre,
        slug: slugFinal,
        categoria: d.categoria,
        descripcion: d.descripcion || null,
        materiales: d.materiales || null,
        firmeza: d.firmeza,
        badge: d.badge || null,
        activo: d.activo,
        orden: d.orden,
        garantia: d.garantia || null,
      })
      .select("id")
      .single();
    if (eI) throw new Error(`No se pudo crear el producto: ${eI.message}`);
    productoId = nuevo.id;
  }

  const { error: eDelM } = await admin
    .from("producto_medidas")
    .delete()
    .eq("producto_id", productoId);
  if (eDelM) throw new Error(`Error al reemplazar medidas: ${eDelM.message}`);
  if (d.medidas.length) {
    const { error: eInsM } = await admin.from("producto_medidas").insert(
      d.medidas.map((m) => ({
        producto_id: productoId,
        medida: m.medida,
        dimensiones: m.dimensiones || null,
        precio_normal: Math.round(m.precio_normal),
        precio_rebajado: m.precio_rebajado ?? null,
        disponible: m.disponible,
      }))
    );
    if (eInsM) throw new Error(`Error al guardar medidas: ${eInsM.message}`);
  }

  const { error: eDelI } = await admin
    .from("producto_imagenes")
    .delete()
    .eq("producto_id", productoId);
  if (eDelI) throw new Error(`Error al reemplazar imágenes: ${eDelI.message}`);
  if (d.imagenes.length) {
    const { error: eInsI } = await admin.from("producto_imagenes").insert(
      d.imagenes.map((img, idx) => ({
        producto_id: productoId,
        url: img.url,
        tipo: img.tipo,
        orden: idx,
        alt: img.alt || null,
      }))
    );
    if (eInsI) throw new Error(`Error al guardar imágenes: ${eInsI.message}`);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/admin/productos/nuevo");
  revalidatePath("/");
  revalidatePath(`/producto/${slugFinal}`);
  revalidatePath("/sitemap.xml");

  return { slug: slugFinal };
}

export async function updateEstadoCotizacion(id: string, estado: string) {
  await requireAdmin();

  if (!(ESTADOS_COTIZACION as readonly string[]).includes(estado)) {
    throw new Error("Estado inválido");
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("cotizaciones")
    .update({ estado })
    .eq("id", id);
  if (error) {
    throw new Error(`No se pudo actualizar el estado: ${error.message}`);
  }

  revalidatePath("/admin/cotizaciones");
}

export async function toggleProductoActivo(slug: string, activo: boolean) {
  await requireAdmin();

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("productos")
    .update({ activo })
    .eq("slug", slug);
  if (error) {
    throw new Error(`No se pudo actualizar el producto: ${error.message}`);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/sitemap.xml");
}
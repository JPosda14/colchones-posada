"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  productoSchema,
  ProductoFormData,
  CATEGORIAS,
  BADGES,
  TIPOS_IMAGEN,
} from "@/lib/validations";
import { slugify } from "@/lib/slug";
import { createClient } from "@/utils/supabase/client";
import { saveProducto } from "@/app/admin/actions";
import type { ProductoEdicion } from "@/lib/admin/productos";

const INPUT_CLASS =
  "w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]";
const ERROR_INPUT_CLASS =
  "w-full rounded-lg border border-red-400 bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 min-h-[44px]";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-texto-suave";

const CATEGORIA_LABEL: Record<string, string> = {
  colchon: "Colchón",
  base: "Base",
  almohada: "Almohada",
  protector: "Protector",
};
const BADGE_LABEL: Record<string, string> = {
  "mas-vendido": "Más vendido",
  premium: "Premium",
  oferta: "Oferta",
};

const MARCA_STORAGE = "/storage/v1/object/public/productos/";

type Props = {
  producto: ProductoEdicion | null;
};

function defaults(producto: ProductoEdicion | null): ProductoFormData {
  if (producto) {
    return {
      nombre: producto.nombre,
      slug: producto.slug,
      categoria: producto.categoria as ProductoFormData["categoria"],
      descripcion: producto.descripcion ?? "",
      materiales: producto.materiales ?? "",
      firmeza: producto.firmeza,
      badge: (producto.badge as ProductoFormData["badge"]) ?? "",
      activo: producto.activo,
      orden: producto.orden,
      garantia: producto.garantia ?? "",
      medidas: producto.medidas.map((m) => ({
        medida: m.medida,
        dimensiones: m.dimensiones ?? "",
        precio_normal: m.precio_normal,
        precio_rebajado: m.precio_rebajado ?? null,
        disponible: m.disponible,
      })),
      imagenes: producto.imagenes.map((img, i) => ({
        url: img.url,
        tipo: img.tipo,
        orden: i,
        alt: img.alt ?? "",
      })),
    };
  }
  return {
    nombre: "",
    slug: "",
    categoria: "colchon",
    descripcion: "",
    materiales: "",
    firmeza: 3,
    badge: "",
    activo: true,
    orden: 0,
    garantia: "",
    medidas: [{ medida: "", dimensiones: "", precio_normal: 0, precio_rebajado: null, disponible: true }],
    imagenes: [],
  };
}

function redimensionar(
  file: File,
  maxDim = 1600
): Promise<{ blob: Blob; nombre: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo redimensionar la imagen"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const esPng = file.type === "image/png";
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error("No se pudo procesar la imagen"));
            return;
          }
          const base =
            file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 40) ||
            "imagen";
          resolve({ blob, nombre: `${base}.${esPng ? "png" : "jpg"}` });
        },
        esPng ? "image/png" : "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Archivo de imagen inválido"));
    };
    img.src = url;
  });
}

export function ProductoForm({ producto }: Props) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const slugAutoRef = useRef(!producto);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: defaults(producto),
  });

  const categoria = watch("categoria");
  const nombre = watch("nombre");
  const firmeza = watch("firmeza");

  const { fields: camposMedida, append: addMedida, remove: removeMedida } =
    useFieldArray({ control, name: "medidas" });
  const {
    fields: imagenes,
    append: addImagen,
    remove: removeImagen,
    move: moveImagen,
  } = useFieldArray({ control, name: "imagenes" });

  useEffect(() => reset(producto ? defaults(producto) : defaults(null)), [producto, reset]);

  useEffect(() => {
    if (!slugAutoRef.current) return;
    if (!slugify(nombre ?? "")) return;
    setValue("slug", slugify(nombre ?? ""), { shouldDirty: true, shouldValidate: true });
  }, [nombre, setValue]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && !guardando) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, guardando]);

  const numRequerido = (v: unknown) => (v === "" ? "" : Number(v));
  const numNulo = (v: unknown) => (v === "" || v === null ? null : Number(v));

  const subirArchivos = async (files: FileList | File[]) => {
    const supabase = createClient();
    const slugActual = slugify(watch("nombre")) || "sin-slug";
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: solo se admiten imágenes`);
        continue;
      }
      try {
        const { blob, nombre: archivo } = await redimensionar(file);
        const path = `productos/${slugActual}/${Date.now()}-${archivo}`;
        const { error } = await supabase.storage
          .from("productos")
          .upload(path, blob, {
            contentType: blob.type,
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        const url = supabase.storage
          .from("productos")
          .getPublicUrl(path).data.publicUrl;
        addImagen({ url, tipo: "frontal", orden: imagenes.length, alt: "" });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo subir la imagen"
        );
      }
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files?.length) void subirArchivos(e.dataTransfer.files);
  };

  const quitarImagen = (index: number) => {
    const img = imagenes[index];
    if (img?.url.includes(MARCA_STORAGE)) {
      const path = img.url.slice(img.url.indexOf(MARCA_STORAGE) + MARCA_STORAGE.length);
      if (path) {
        createClient()
          .storage.from("productos")
          .remove([path])
          .catch(() => {});
      }
    }
    removeImagen(index);
  };

  const errorCls = (index: number, campo: string): string | undefined => {
    const fila = (errors.medidas as Array<Record<string, { message?: string }>> | undefined)?.[index];
    if (!fila) return undefined;
    return fila[campo]?.message;
  };

  const onSubmit = async (data: ProductoFormData) => {
    setGuardando(true);
    setErrorGlobal(null);
    try {
      const norm: ProductoFormData = {
        ...data,
        firmeza: data.categoria === "colchon" ? data.firmeza : null,
        imagenes: data.imagenes.map((img, i) => ({ ...img, orden: i })),
      };
      const res = await saveProducto({ ...norm, id: producto?.id });
      toast.success(producto ? "Producto actualizado" : "Producto creado");
      router.replace(`/admin/productos/${res.slug}/editar`);
      router.refresh();
    } catch (err) {
      setErrorGlobal(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorGlobal && (
        <div role="alert" aria-live="polite" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
          {errorGlobal}
        </div>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-admin text-lg font-semibold text-verde">Información general</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="nombre" className={LABEL_CLASS}>Nombre *</label>
            <input id="nombre" {...register("nombre")} className={errors.nombre ? ERROR_INPUT_CLASS : INPUT_CLASS} placeholder="Ej: Ortopédico Cassata" />
            {errors.nombre && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.nombre.message}</span>}
          </div>
          <div>
            <label htmlFor="slug" className={LABEL_CLASS}>Slug (URL) *</label>
            <input
              id="slug"
              {...register("slug", {
                onChange: () => (slugAutoRef.current = false),
              })}
              className={errors.slug ? ERROR_INPUT_CLASS : INPUT_CLASS}
              placeholder="ortopedico-cassata"
            />
            {errors.slug && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.slug.message}</span>}
            <p className="mt-1 text-xs text-texto-suave">Se genera solo desde el nombre. URL: /producto/{slugify(watch("slug")) || "..."}</p>
          </div>
          <div>
            <label htmlFor="categoria" className={LABEL_CLASS}>Categoría *</label>
            <select id="categoria" {...register("categoria")} className={INPUT_CLASS}>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="badge" className={LABEL_CLASS}>Etiqueta destacada</label>
            <select id="badge" {...register("badge")} className={INPUT_CLASS}>
              <option value="">Sin etiqueta</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>{BADGE_LABEL[b]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="garantia" className={LABEL_CLASS}>Garantía</label>
            <input id="garantia" {...register("garantia")} className={INPUT_CLASS} placeholder="Ej: 8 años" />
          </div>
          <div>
            <label htmlFor="orden" className={LABEL_CLASS}>Orden en el catálogo</label>
            <input id="orden" type="number" inputMode="numeric" min={0} max={999}
              {...register("orden", { setValueAs: numRequerido })}
              className={errors.orden ? ERROR_INPUT_CLASS : INPUT_CLASS}
            />
            {errors.orden && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.orden.message}</span>}
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-crema-oscura px-4 py-3">
            <input id="activo" type="checkbox" {...register("activo")} className="h-5 w-5 accent-verde" />
            <label htmlFor="activo" className="text-sm text-texto-suave">Producto publicado (visible en la web)</label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-admin text-lg font-semibold text-verde">Descripción</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="descripcion" className={LABEL_CLASS}>Descripción</label>
            <textarea id="descripcion" rows={5} {...register("descripcion")} className={INPUT_CLASS} placeholder="Describe el producto..." />
            {errors.descripcion && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.descripcion.message}</span>}
          </div>
          <div>
            <label htmlFor="materiales" className={LABEL_CLASS}>Materiales</label>
            <textarea id="materiales" rows={3} {...register("materiales")} className={INPUT_CLASS} placeholder="Ej: espuma, resortes..." />
            {errors.materiales && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.materiales.message}</span>}
          </div>
          {categoria === "colchon" && (
            <div>
              <label htmlFor="firmeza" className={LABEL_CLASS}>Firmeza: {firmeza ?? 3} / 5</label>
              <input id="firmeza" type="range" min={1} max={5} step={1}
                {...register("firmeza", { setValueAs: numRequerido })}
                className="mt-3 w-full accent-verde"
              />
              <div className="mt-1 flex justify-between text-xs text-texto-suave">
                <span>1 · Suave</span>
                <span>5 · Muy firme</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-admin text-lg font-semibold text-verde">Medidas y precios</h2>
          <button type="button" onClick={() => addMedida({ medida: "", dimensiones: "", precio_normal: 0, precio_rebajado: null, disponible: true })}
            className="rounded-lg border border-verde px-3 py-1.5 text-sm text-verde hover:bg-verde-muy-claro">
            + Agregar medida
          </button>
        </div>
        {errors.medidas?.message && (
          <span role="alert" className="mt-2 block text-sm text-red-500">{errors.medidas.message}</span>
        )}
        <div className="mt-4 space-y-4">
          {camposMedida.map((campo, i) => (
            <div key={campo.id} className="grid gap-3 rounded-xl border border-crema-oscura p-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <label className={LABEL_CLASS}>Medida *</label>
                <input {...register(`medidas.${i}.medida`)} className={errorCls(i, "medida") ? ERROR_INPUT_CLASS : INPUT_CLASS} placeholder="Ej: 1.40 x 1.90" />
                {errorCls(i, "medida") && <span className="mt-1 block text-xs text-red-500">{errorCls(i, "medida")}</span>}
              </div>
              <div className="md:col-span-3">
                <label className={LABEL_CLASS}>Dimensiones</label>
                <input {...register(`medidas.${i}.dimensiones`)} className={INPUT_CLASS} placeholder="Ej: 140x190 cm" />
              </div>
              <div className="md:col-span-2">
                <label className={LABEL_CLASS}>Precio normal *</label>
                <input type="number" inputMode="numeric" {...register(`medidas.${i}.precio_normal`, { setValueAs: numRequerido })} className={errorCls(i, "precio_normal") ? ERROR_INPUT_CLASS : INPUT_CLASS} placeholder="0" />
                {errorCls(i, "precio_normal") && <span className="mt-1 block text-xs text-red-500">{errorCls(i, "precio_normal")}</span>}
              </div>
              <div className="md:col-span-2">
                <label className={LABEL_CLASS}>Precio rebajado</label>
                <input type="number" inputMode="numeric" {...register(`medidas.${i}.precio_rebajado`, { setValueAs: numNulo })} className={errorCls(i, "precio_rebajado") ? ERROR_INPUT_CLASS : INPUT_CLASS} placeholder="—" />
                {errorCls(i, "precio_rebajado") && <span className="mt-1 block text-xs text-red-500">{errorCls(i, "precio_rebajado")}</span>}
              </div>
              <div className="md:col-span-2 flex items-end justify-between gap-2">
                <label className="flex items-center gap-2 pb-2.5 text-sm text-texto-suave">
                  <input type="checkbox" {...register(`medidas.${i}.disponible`)} className="h-5 w-5 accent-verde" />
                  Disponible
                </label>
                <button type="button" onClick={() => removeMedida(i)} disabled={camposMedida.length <= 1}
                  className="rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40" aria-label={`Quitar medida ${i + 1}`}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-admin text-lg font-semibold text-verde">Imágenes</h2>
        <div
          onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={onDrop}
          onClick={() => inputFileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputFileRef.current?.click(); }}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
            arrastrando ? "border-verde bg-verde-muy-claro" : "border-crema-oscura bg-crema/50 hover:border-verde"
          }`}
        >
          <p className="text-sm text-texto-suave">
            Arrastra tus fotos aquí o <span className="font-semibold text-verde">haz clic para elegir</span>
          </p>
          <p className="mt-1 text-xs text-texto-suave">
            Se redimensionan automáticamente (máx. 1600px).
          </p>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void subirArchivos(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {errors.imagenes?.message && (
          <span role="alert" className="mt-2 block text-sm text-red-500">{errors.imagenes.message}</span>
        )}
        <div className="mt-4 space-y-3">
          {imagenes.map((campo, i) => (
            <div key={campo.id} className="flex flex-col gap-3 rounded-xl border border-crema-oscura p-3 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={campo.url} alt={campo.alt || `Imagen ${i + 1}`} className="h-20 w-20 rounded-lg object-cover" />
                {i === 0 && (
                  <span className="absolute -top-2 -left-2 rounded-full bg-verde px-2 py-0.5 text-[10px] font-semibold text-white">
                    Portada
                  </span>
                )}
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLASS}>Tipo</label>
                  <select {...register(`imagenes.${i}.tipo`)} className={INPUT_CLASS}>
                    {TIPOS_IMAGEN.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Texto alternativo (SEO)</label>
                  <input {...register(`imagenes.${i}.alt`)} className={INPUT_CLASS} placeholder="Describe la foto" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveImagen(i, i - 1)} disabled={i === 0}
                  className="rounded-lg border border-crema-oscura px-2 py-2 text-sm text-texto-suave hover:text-verde disabled:opacity-40" aria-label="Subir imagen">
                  ↑
                </button>
                <button type="button" onClick={() => moveImagen(i, i + 1)} disabled={i === imagenes.length - 1}
                  className="rounded-lg border border-crema-oscura px-2 py-2 text-sm text-texto-suave hover:text-verde disabled:opacity-40" aria-label="Bajar imagen">
                  ↓
                </button>
                <button type="button" onClick={() => quitarImagen(i)} disabled={imagenes.length <= 1}
                  className="rounded-lg border border-crema-oscura px-2 py-2 text-sm text-red-600 hover:border-red-300 disabled:opacity-40" aria-label="Quitar imagen">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-crema-oscura bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.replace("/admin/productos")}
            disabled={guardando}
            className="rounded-lg border border-crema-oscura px-4 py-2.5 text-sm text-texto-suave hover:text-texto disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            type="submit"
            disabled={guardando || Object.keys(errors).length > 0}
            className="rounded-lg bg-verde px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-verde-oscuro disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </div>
    </form>
  );
}
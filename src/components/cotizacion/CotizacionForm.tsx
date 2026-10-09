"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { cotizacionSchema, CotizacionFormData } from "@/lib/validations";
import type { Producto, ProductoMedida } from "@/types";

const PRODUCTOS_SIN_MEDIDA = [
  "Almohada Sencilla",
  "Almohada Normal",
  "Almohada Acolchada",
  "Almohada Memory Foam",
];

const GRUPOS: Array<{ label: string; categoria: Producto["categoria"] }> = [
  { label: "Colchones", categoria: "colchon" },
  { label: "Bases", categoria: "base" },
  { label: "Almohadas", categoria: "almohada" },
  { label: "Protectores", categoria: "protector" },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]";

const ERROR_INPUT_CLASS =
  "w-full rounded-lg border border-red-400 bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 min-h-[44px]";

const LABEL_CLASS =
  "mb-1 block text-sm font-medium text-texto-suave";

function builderMensajeWhatsApp(d: CotizacionFormData) {
  let mensaje = `Hola, soy ${d.nombre}. Vivo en ${d.municipio}. Me interesa cotizar ${d.producto_interes}`;
  if (d.medida_interes) mensaje += ` en medida ${d.medida_interes}`;
  if (d.peso) mensaje += `. Peso: ${d.peso} kg`;
  if (d.preferencia_dureza) mensaje += `. Preferencia: ${d.preferencia_dureza}`;
  if (d.comentario) mensaje += `. Comentario: ${d.comentario}`;
  mensaje += `. Mi teléfono es ${d.telefono}.`;
  return mensaje;
}

export function CotizacionForm({ productos }: { productos: Producto[] }) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CotizacionFormData>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      nombre: "",
      municipio: "",
      telefono: "",
      peso: "",
      preferencia_dureza: "",
      producto_interes: "",
      medida_interes: "",
      comentario: "",
    },
  });

  const productoInteres = watch("producto_interes");
  const productoActual = productos.find((p) => p.nombre === productoInteres);
  const medidasDisponibles: ProductoMedida[] = productoActual
    ? productoActual.medidas.filter((m) => m.disponible)
    : [];
  const mostrarMedida =
    Boolean(productoInteres) &&
    !PRODUCTOS_SIN_MEDIDA.includes(productoInteres);

  const onSubmit = async (data: CotizacionFormData) => {
    setEnviando(true);
    setErrorEnvio(false);
    try {
      const res = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          municipio: data.municipio,
          telefono: data.telefono,
          producto_interes: data.producto_interes,
          medida_interes: data.medida_interes,
          comentario: data.comentario,
          canal: "web",
        }),
      });
      if (!res.ok) throw new Error("Error en envío");

      const mensaje = builderMensajeWhatsApp(data);
      window.open(
        `https://wa.me/573112288444?text=${encodeURIComponent(mensaje)}`,
        "_blank"
      );
      setEnviado(true);
      reset();
    } catch {
      setErrorEnvio(true);
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="mt-8 rounded-lg bg-verde-muy-claro p-6 text-center">
        <p className="font-heading text-xl font-bold text-verde">
          ¡Cotización enviada!
        </p>
        <p className="mt-1 text-texto">
          Le contactaremos pronto.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => setEnviado(false)}
        >
          Enviar otra cotización
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      {errorEnvio && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600"
        >
          Ocurrió un error. Por favor intente de nuevo o escríbanos por WhatsApp.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={LABEL_CLASS}>
            Nombre completo *
          </label>
          <input
            id="nombre"
            aria-required="true"
            {...register("nombre")}
            className={errors.nombre ? ERROR_INPUT_CLASS : INPUT_CLASS}
            placeholder="Su nombre"
          />
          {errors.nombre && (
            <span
              role="alert"
              aria-live="polite"
              className="mt-1 block text-xs text-red-500"
            >
              {errors.nombre.message}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="municipio" className={LABEL_CLASS}>
            Municipio *
          </label>
          <input
            id="municipio"
            aria-required="true"
            {...register("municipio")}
            className={errors.municipio ? ERROR_INPUT_CLASS : INPUT_CLASS}
            placeholder="Armenia, Calarcá, ..."
          />
          {errors.municipio && (
            <span
              role="alert"
              aria-live="polite"
              className="mt-1 block text-xs text-red-500"
            >
              {errors.municipio.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="telefono" className={LABEL_CLASS}>
          Teléfono / WhatsApp *
        </label>
        <input
          id="telefono"
          type="tel"
          inputMode="numeric"
          aria-required="true"
          {...register("telefono", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
          className={errors.telefono ? ERROR_INPUT_CLASS : INPUT_CLASS}
          placeholder="3000000000"
        />
        {errors.telefono && (
          <span
            role="alert"
            aria-live="polite"
            className="mt-1 block text-xs text-red-500"
          >
            {errors.telefono.message}
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="peso" className={LABEL_CLASS}>
            Peso de la persona que va a usar el colchón
          </label>
          <input
            id="peso"
            type="number"
            inputMode="numeric"
            {...register("peso")}
            className={INPUT_CLASS}
            placeholder="Ej: 70 kg"
          />
        </div>
        <div>
          <label htmlFor="dureza" className={LABEL_CLASS}>
            Preferencia de dureza del colchón
          </label>
          <select id="dureza" {...register("preferencia_dureza")} className={INPUT_CLASS}>
            <option value="">Seleccione...</option>
            <option value="Blanda">Blanda</option>
            <option value="Media">Media</option>
            <option value="Firme">Firme</option>
            <option value="Muy firme">Muy firme</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="producto" className={LABEL_CLASS}>
            Producto de interés *
          </label>
          <select
            id="producto"
            aria-required="true"
            {...register("producto_interes")}
            className={
              errors.producto_interes ? ERROR_INPUT_CLASS : INPUT_CLASS
            }
          >
            <option value="">Seleccione...</option>
            {GRUPOS.map((grupo) => {
              const delGrupo = productos.filter(
                (p) => p.categoria === grupo.categoria
              );
              if (delGrupo.length === 0) return null;
              return (
                <optgroup key={grupo.categoria} label={grupo.label}>
                  {delGrupo.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          {errors.producto_interes && (
            <span
              role="alert"
              aria-live="polite"
              className="mt-1 block text-xs text-red-500"
            >
              {errors.producto_interes.message}
            </span>
          )}
        </div>

        {mostrarMedida && (
          <div>
            <label htmlFor="medida" className={LABEL_CLASS}>
              Medida de interés
            </label>
            <select id="medida" {...register("medida_interes")} className={INPUT_CLASS}>
              <option value="">Seleccione...</option>
              {medidasDisponibles.map((m) => (
                <option key={m.id} value={m.medida}>
                  {m.medida}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="comentario" className={LABEL_CLASS}>
          Comentario adicional
        </label>
        <textarea
          id="comentario"
          rows={3}
          {...register("comentario")}
          className={INPUT_CLASS}
          placeholder="¿Alguna pregunta o requerimiento especial?"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={enviando}>
        {enviando ? "Enviando..." : "Enviar solicitud 📨"}
      </Button>
    </form>
  );
}
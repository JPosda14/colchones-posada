"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { updateEstadoCotizacion } from "@/app/admin/actions";
import {
  ESTADOS_COTIZACION,
  ESTADOS_LABEL,
  type CotizacionFila,
  type EstadoCotizacion,
} from "@/lib/cotizaciones";

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const COLOR_ESTADO: Record<EstadoCotizacion, string> = {
  nueva: "bg-amber-100 text-amber-800",
  contactado: "bg-sky-100 text-sky-800",
  cerrada: "bg-gray-100 text-gray-600",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-sm text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde";

export function CotizacionesList({
  cotizaciones,
}: {
  cotizaciones: CotizacionFila[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [cambiandoId, setCambiandoId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtradas = cotizaciones.filter((c) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return [c.nombre, c.municipio, c.telefono, c.producto_interes]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const contar = (e: EstadoCotizacion) =>
    cotizaciones.filter((c) => c.estado === e).length;

  const cambiarEstado = (c: CotizacionFila, estado: EstadoCotizacion) => {
    setCambiandoId(c.id);
    startTransition(async () => {
      try {
        await updateEstadoCotizacion(c.id, estado);
        toast.success(`Cotización marcada como "${ESTADOS_LABEL[estado]}"`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo actualizar"
        );
      } finally {
        setCambiandoId(null);
      }
    });
  };

  const selectorEstado = (c: CotizacionFila) => (
    <select
      value={c.estado}
      aria-label="Cambiar estado"
      disabled={cambiandoId === c.id}
      onChange={(e) => cambiarEstado(c, e.target.value as EstadoCotizacion)}
      className={`rounded-lg border px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-verde disabled:opacity-60 ${COLOR_ESTADO[c.estado]}`}
    >
      {ESTADOS_COTIZACION.map((e) => (
        <option key={e} value={e}>
          {ESTADOS_LABEL[e]}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-texto">{cotizaciones.length}</p>
          <p className="text-xs text-texto-suave">Total</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{contar("nueva")}</p>
          <p className="text-xs text-amber-800">Nuevas</p>
        </div>
        <div className="rounded-2xl bg-sky-50 p-4 shadow-sm">
          <p className="text-2xl font-bold text-sky-700">
            {contar("contactado")}
          </p>
          <p className="text-xs text-sky-800">Contactadas</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-600">{contar("cerrada")}</p>
          <p className="text-xs text-gray-500">Cerradas</p>
        </div>
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre, municipio, teléfono o producto..."
        className={`${INPUT_CLASS} mt-4 max-w-xl`}
        aria-label="Buscar cotizaciones"
      />

      {filtradas.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-texto-suave">
            {cotizaciones.length === 0
              ? "Aún no hay cotizaciones. Las solicitudes del formulario aparecerán aquí."
              : "No se encontraron resultados para esa búsqueda."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-crema-oscura bg-crema text-xs uppercase tracking-wide text-texto-suave">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-crema-oscura/60 last:border-0"
                  >
                    <td className="px-4 py-3 text-texto-suave">
                      {formatearFecha(c.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-texto">{c.nombre}</p>
                      <p className="text-xs text-texto-suave">{c.municipio}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-texto">{c.producto_interes}</p>
                      {c.medida_interes && (
                        <p className="text-xs text-texto-suave">
                          {c.medida_interes}
                        </p>
                      )}
                      {c.comentario && (
                        <p
                          className="mt-0.5 max-w-xs truncate text-xs italic text-texto-suave"
                          title={c.comentario}
                        >
                          {c.comentario}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/${c.telefono}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-verde hover:underline"
                      >
                        {c.telefono}
                      </a>
                    </td>
                    <td className="px-4 py-3">{selectorEstado(c)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 space-y-3 md:hidden">
            {filtradas.map((c) => (
              <li key={c.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-texto">{c.nombre}</p>
                    <p className="text-xs text-texto-suave">
                      {c.municipio} · {formatearFecha(c.createdAt)}
                    </p>
                  </div>
                  {selectorEstado(c)}
                </div>
                <p className="mt-2 text-texto">{c.producto_interes}</p>
                {c.medida_interes && (
                  <p className="text-xs text-texto-suave">{c.medida_interes}</p>
                )}
                <a
                  href={`https://wa.me/${c.telefono}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm font-medium text-verde hover:underline"
                >
                  WhatsApp: {c.telefono}
                </a>
                {c.comentario && (
                  <p className="mt-2 text-sm italic text-texto-suave">
                    {c.comentario}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
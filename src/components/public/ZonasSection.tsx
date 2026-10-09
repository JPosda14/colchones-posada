"use client";

import { Button } from "@/components/ui";

const ZONAS = [
  {
    municipio: "Armenia",
    entrega: "Entrega el mismo día",
    badge: "Domicilio gratis",
  },
  {
    municipio: "Calarcá",
    entrega: "Entrega el mismo día",
    badge: "Domicilio gratis",
  },
  {
    municipio: "Génova",
    entrega: "Consultar disponibilidad",
    badge: "Domicilio gratis",
  },
  {
    municipio: "Otros municipios",
    entrega: "Consultar",
    badge: null,
  },
];

export function ZonasSection() {
  return (
    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {ZONAS.map((zona) => (
        <div
          key={zona.municipio}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg">
            📍
          </div>
          <h3 className="mt-4 font-heading text-xl font-bold text-white">
            {zona.municipio}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-verde-muy-claro/75">
            {zona.entrega}
          </p>
          {zona.badge && (
            <span className="mt-4 inline-block rounded-full bg-verde-claro/20 px-3 py-1 text-xs font-semibold tracking-wide text-verde-claro uppercase">
              {zona.badge}
            </span>
          )}
          {zona.municipio === "Otros municipios" && (
            <Button
              variant="whatsapp"
              size="sm"
              onClick={() =>
                window.open("https://wa.me/573112288444", "_blank")
              }
              className="mt-4"
            >
              Consultar
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
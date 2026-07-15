"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Badge } from "@/components/ui";
import { BarraFirmeza } from "@/components/firmeza/BarraFirmeza";
import { Producto } from "@/types";
import { formatPrecio } from "@/lib/productos";
import { generarLinkWA } from "@/lib/whatsapp";

interface FichaProductoProps {
  producto: Producto;
}

export function FichaProducto({ producto }: FichaProductoProps) {
  const [selectedMeasure, setSelectedMeasure] = useState(producto.medidas[0]);
  const [selectedImage, setSelectedImage] = useState(
    producto.imagenes.find((i) => i.tipo === "frontal") || producto.imagenes[0]
  );

  if (!selectedMeasure) return null;

  const badgeMap: Record<string, { text: string; variant: "verde" | "acento" | "rojo" }> = {
    "mas-vendido": { text: "Más vendido", variant: "verde" },
    premium: { text: "Premium", variant: "acento" },
    oferta: { text: "Oferta", variant: "rojo" },
  };

  const tieneDescuento =
    selectedMeasure.precio_rebajado !== null &&
    selectedMeasure.precio_rebajado < selectedMeasure.precio_normal;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Galería */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-crema-oscura">
          {selectedImage ? (
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || producto.nombre}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-texto-suave">
              Sin imagen
            </div>
          )}
        </div>
        {producto.imagenes.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory">
            {producto.imagenes.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative h-16 w-20 flex-shrink-0 snap-start overflow-hidden rounded-lg border-2 ${
                  selectedImage.id === img.id
                    ? "border-verde"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5">
        {producto.badge && badgeMap[producto.badge] && (
          <Badge variant={badgeMap[producto.badge].variant}>
            {badgeMap[producto.badge].text}
          </Badge>
        )}

        <h1 className="font-heading text-3xl font-bold text-texto">
          {producto.nombre}
        </h1>

        <p className="text-texto-suave">{producto.descripcion}</p>

        {/* Selector de medidas */}
        <div>
          <p className="mb-2 text-sm font-medium text-texto-suave">Medida</p>
          <div className="flex flex-wrap gap-2">
            {producto.medidas.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMeasure(m)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                  selectedMeasure.id === m.id
                    ? "border-verde bg-verde text-white"
                    : "border-crema-oscura bg-white text-texto hover:border-verde"
                }`}
              >
                {m.medida}
                {m.dimensiones && (
                  <span className="ml-1 text-xs opacity-75">
                    ({m.dimensiones})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          {tieneDescuento ? (
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-verde">
                {formatPrecio(selectedMeasure.precio_rebajado!)}
              </span>
              <span className="text-lg text-acento line-through">
                {formatPrecio(selectedMeasure.precio_normal)}
              </span>
            </div>
          ) : (
            <span className="font-heading text-3xl font-bold text-verde">
              {formatPrecio(selectedMeasure.precio_normal)}
            </span>
          )}
          <p className="mt-1 text-xs text-texto-suave">
            *Sin IVA (régimen simplificado). Precios pueden variar según materiales.
          </p>
        </div>

        {/* Barra de firmeza */}
        {producto.firmeza && <BarraFirmeza valor={producto.firmeza} />}

        {/* Atributos */}
        {producto.materiales && (
          <div>
            <p className="text-sm font-medium text-texto-suave">Materiales</p>
            <p className="text-sm text-texto">{producto.materiales}</p>
          </div>
        )}

        {/* Atributos grid */}
        <div className="grid grid-cols-1 gap-3 rounded-xl bg-crema-oscura p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-texto-suave">Altura</p>
            <p className="text-sm font-medium text-texto">
              {selectedMeasure.dimensiones?.split(",")[1]?.trim() || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-texto-suave">Garantía</p>
            <p className="text-sm font-medium text-texto">
              {producto.categoria === "colchon" ? "5 años" : "1 año"}
            </p>
          </div>
          <div>
            <p className="text-xs text-texto-suave">Fabricación</p>
            <p className="text-sm font-medium text-texto">Propia</p>
          </div>
          <div>
            <p className="text-xs text-texto-suave">Medidas especiales</p>
            <p className="text-sm font-medium text-texto">Sí, cotizar</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button
            variant="whatsapp"
            size="lg"
            onClick={() => {
              const link = generarLinkWA(
                producto.nombre,
                selectedMeasure.medida
              );
              window.open(link, "_blank");
            }}
          >
            💬 Pedir por WhatsApp
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = "/#cotizar"}>
            📋 Solicitar cotización
          </Button>
        </div>

        <p className="text-xs text-texto-suave">
          🚚 Domicilio gratis en Armenia, Calarcá y Génova. Entregas el mismo día.
        </p>
      </div>
    </div>
  );
}

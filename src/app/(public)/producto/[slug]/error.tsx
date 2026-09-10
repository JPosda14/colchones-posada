"use client";

import { Button } from "@/components/ui";

export default function ProductoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
        <p
          className="text-6xl font-normal leading-none text-verde-claro"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ¡Ups!
        </p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">
          Algo salió mal
        </h1>
        <p className="mt-2 text-verde-muy-claro/75">
          Ocurrió un error al cargar el producto. Inténtalo de nuevo.
        </p>
        <Button variant="primary" className="mt-6" onClick={() => reset()}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
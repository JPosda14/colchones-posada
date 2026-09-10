"use client";

import { Button } from "@/components/ui";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p
        className="text-7xl font-normal leading-none text-verde"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        ¡Ups!
      </p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-texto">
        Algo salió mal
      </h1>
      <p className="mt-2 max-w-md text-texto-suave">
        Ocurrió un error inesperado. Inténtalo de nuevo.
      </p>
      <Button variant="primary" className="mt-6" onClick={() => reset()}>
        Reintentar
      </Button>
    </div>
  );
}
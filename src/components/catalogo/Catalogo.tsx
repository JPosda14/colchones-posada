"use client";

import { useState } from "react";
import { FiltroBar, ProductoCard } from "@/components/catalogo";
import type { Producto } from "@/types";

interface CatalogoProps {
  productos: Producto[];
}

export function Catalogo({ productos }: CatalogoProps) {
  const [filtro, setFiltro] = useState("todos");

  const productosFiltrados =
    filtro === "todos"
      ? productos.filter((p) => p.activo)
      : productos.filter((p) => p.categoria === filtro && p.activo);

  return (
    <div className="mt-8">
      <FiltroBar activo={filtro} onChange={setFiltro} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productosFiltrados.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <p className="py-12 text-center text-texto-suave">
          No hay productos en esta categoría.
        </p>
      )}
    </div>
  );
}
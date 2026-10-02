"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteProducto, toggleProductoActivo } from "@/app/admin/actions";
import type { AdminProductoRow } from "@/lib/admin/productos";

const CATEGORIA_LABEL: Record<string, string> = {
  colchon: "Colchón",
  base: "Base",
  almohada: "Almohada",
  protector: "Protector",
};

const CATEGORIAS_FILTRO = [
  { valor: "", label: "Todas" },
  { valor: "colchon", label: "Colchones" },
  { valor: "base", label: "Bases" },
  { valor: "almohada", label: "Almohadas" },
  { valor: "protector", label: "Protectores" },
] as const;

const ESTADOS = [
  { valor: "todos", label: "Todos" },
  { valor: "activo", label: "Activos" },
  { valor: "inactivo", label: "Inactivos" },
] as const;

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <tr key={i} className="border-b border-crema-oscura/50">
          <td colSpan={cols} className="px-4 py-4">
            <div className="h-14 animate-pulse rounded-lg bg-crema"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function ProductosList({ productos }: { productos: AdminProductoRow[] }) {
  const router = useRouter();
  const [termino, setTermino] = useState("");
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]["valor"]>("todos");
  const [categoria, setCategoria] = useState<string>("");
  const [confirmando, setConfirmando] = useState<AdminProductoRow | null>(null);
  const [alternando, setAlternando] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [, startToggle] = useTransition();

  const filtrados = useMemo(() => {
    const q = termino.trim().toLowerCase();
    return productos.filter((p) => {
      if (estado === "activo" && !p.activo) return false;
      if (estado === "inactivo" && p.activo) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (!q) return true;
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    });
  }, [productos, termino, estado, categoria]);

  const alternar = (p: AdminProductoRow) => {
    setAlternando(p.slug);
    startToggle(async () => {
      try {
        await toggleProductoActivo(p.slug, !p.activo);
        toast.success(
          p.activo
            ? `"${p.nombre}" ocultado de la web`
            : `"${p.nombre}" publicado en la web`
        );
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo actualizar el producto"
        );
      } finally {
        setAlternando(null);
      }
    });
  };

  const eliminar = () => {
    if (!confirmando) return;
    startTransition(async () => {
      await deleteProducto(confirmando.slug);
      setConfirmando(null);
      router.refresh();
    });
  };

  const badgeActivo = (activo: boolean) =>
    activo ? (
      <span className="rounded-full bg-verde-muy-claro px-2 py-0.5 text-xs text-verde">
        Sí
      </span>
    ) : (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
        No
      </span>
    );

  const portada = (p: AdminProductoRow) =>
    p._portada ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p._portada}
        alt={p.nombre}
        className="h-12 w-12 rounded-lg object-cover"
      />
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crema text-lg text-texto-suave">
        🛏️
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar por nombre, slug o categoría..."
          className="w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-sm text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde sm:max-w-sm"
          aria-label="Buscar productos"
        />
        <div className="flex gap-2" role="group" aria-label="Filtrar por estado">
          {ESTADOS.map((e) => (
            <button
              key={e.valor}
              type="button"
              onClick={() => setEstado(e.valor)}
              aria-pressed={estado === e.valor}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                estado === e.valor
                  ? "bg-verde text-white"
                  : "bg-white text-texto-suave hover:text-verde border border-crema-oscura"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        {CATEGORIAS_FILTRO.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => setCategoria(c.valor)}
            aria-pressed={categoria === c.valor}
            className={`rounded-full px-3 py-1 text-xs transition ${
              categoria === c.valor
                ? "bg-verde text-white"
                : "bg-white text-texto-suave hover:text-verde border border-crema-oscura"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtrados.length === 0 && !isPending ? (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-texto-suave">No se encontraron productos.</p>
        </div>
      ) : null}

      <div className="mt-6 hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-crema-oscura">
            <tr>
              <th className="px-4 py-3 font-medium text-texto-suave">Producto</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Categoría</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Medidas</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Imágenes</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Activo</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Orden</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <SkeletonRows cols={7} />
            ) : (
              filtrados.map((p) => (
                <tr key={p.id} className="border-b border-crema-oscura/50 hover:bg-crema/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {portada(p)}
                      <div>
                        <p className="font-medium text-texto">{p.nombre}</p>
                        <p className="text-xs text-texto-suave">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-texto-suave">
                    {CATEGORIA_LABEL[p.categoria] ?? p.categoria}
                  </td>
                  <td className="px-4 py-3 text-texto-suave">{p._medidas}</td>
                  <td className="px-4 py-3 text-texto-suave">{p._imagenes}</td>
                  <td className="px-4 py-3">{badgeActivo(p.activo)}</td>
                  <td className="px-4 py-3 text-texto-suave">{p.orden}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/productos/${p.slug}/editar`}
                        className="rounded-lg border border-crema-oscura px-3 py-1.5 text-xs text-verde hover:border-verde"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => alternar(p)}
                        disabled={alternando === p.slug || isPending}
                        className="rounded-lg border border-crema-oscura px-3 py-1.5 text-xs text-texto hover:border-verde hover:text-verde disabled:opacity-60"
                      >
                        {alternando === p.slug
                          ? "..."
                          : p.activo
                            ? "Ocultar"
                            : "Mostrar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmando(p)}
                        className="rounded-lg border border-crema-oscura px-3 py-1.5 text-xs text-red-600 hover:border-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:hidden">
        {isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"></div>
            ))
          : filtrados.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {portada(p)}
                    <div>
                      <p className="font-medium text-texto">{p.nombre}</p>
                      <p className="text-xs text-texto-suave">
                        {CATEGORIA_LABEL[p.categoria] ?? p.categoria} · Orden {p.orden}
                      </p>
                    </div>
                  </div>
                  {badgeActivo(p.activo)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/productos/${p.slug}/editar`}
                    className="flex-1 rounded-lg border border-crema-oscura px-3 py-2 text-center text-xs text-verde hover:border-verde"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => alternar(p)}
                    disabled={alternando === p.slug || isPending}
                    className="flex-1 rounded-lg border border-crema-oscura px-3 py-2 text-center text-xs text-texto hover:border-verde hover:text-verde disabled:opacity-60"
                  >
                    {alternando === p.slug
                      ? "..."
                      : p.activo
                        ? "Ocultar"
                        : "Mostrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(p)}
                    className="flex-1 rounded-lg border border-crema-oscura px-3 py-2 text-center text-xs text-red-600 hover:border-red-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
      </div>

      {confirmando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-eliminar-titulo"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h2 id="modal-eliminar-titulo" className="font-admin text-lg font-bold text-texto">
              Eliminar producto
            </h2>
            <p className="mt-2 text-sm text-texto-suave">
              ¿Seguro que deseas eliminar <strong className="text-texto">{confirmando.nombre}</strong>?
              Se borrarán sus medidas, imágenes y (si aplica) los archivos cargados. Esta acción no se
              puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmando(null)}
                disabled={isPending}
                className="rounded-lg border border-crema-oscura px-4 py-2 text-sm text-texto-suave hover:text-texto disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={eliminar}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import Link from "next/link";
import { listProductosAdmin } from "@/lib/admin/productos";
import { ProductosList } from "@/components/admin/ProductosList";

export const metadata = {
  title: "Productos",
  robots: { index: false, follow: false },
};

export default async function AdminProductosPage() {
  const productos = await listProductosAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-admin text-2xl font-bold text-texto">Productos</h1>
          <p className="mt-1 text-sm text-texto-suave">
            {productos.length} en el catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-lg bg-verde px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-verde-oscuro"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-6">
        <ProductosList productos={productos} />
      </div>
    </div>
  );
}
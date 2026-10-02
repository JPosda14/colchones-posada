import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductoParaEditar } from "@/lib/admin/productos";
import { ProductoForm } from "@/components/admin/ProductoForm";

export const metadata = {
  title: "Editar producto",
  robots: { index: false, follow: false },
};

export default async function EditarProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const producto = await getProductoParaEditar(params.slug);
  if (!producto) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-admin text-2xl font-bold text-texto">
          Editar: {producto.nombre}
        </h1>
        <Link
          href={`/producto/${producto.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-crema-oscura px-3 py-1.5 text-sm text-verde hover:border-verde"
        >
          Ver cómo se ve → 
        </Link>
      </div>
      <p className="mt-1 text-sm text-texto-suave">
        Cambia lo que necesites y guarda. Los cambios se reflejarán en la web.
      </p>
      <div className="mt-6">
        <ProductoForm producto={producto} />
      </div>
    </div>
  );
}
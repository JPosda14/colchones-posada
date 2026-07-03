import { notFound } from "next/navigation";
import { FichaProducto } from "@/components/catalogo/FichaProducto";
import { productos } from "@/lib/productos";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export default function ProductoPage({ params }: Props) {
  const producto = productos.find((p) => p.slug === params.slug);

  if (!producto) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <FichaProducto producto={producto} />
    </div>
  );
}

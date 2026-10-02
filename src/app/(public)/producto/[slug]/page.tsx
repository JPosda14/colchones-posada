import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FichaProducto } from "@/components/catalogo/FichaProducto";
import { getProductoPublico } from "@/lib/productos";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producto = await getProductoPublico(params.slug);

  return {
    title: producto ? producto.nombre : "Producto",
    description: producto
      ? `Comprar ${producto.nombre} en Colchones Posada, Armenia Quindío. ${producto.descripcion}`
      : undefined,
    openGraph: producto
      ? {
          type: "website",
          locale: "es_CO",
          title: `${producto.nombre} | Colchones Posada`,
          description: `Comprar ${producto.nombre} en Colchones Posada, Armenia Quindío.`,
          images: [
            {
              url: "/og/og-image.png",
              width: 1200,
              height: 630,
              alt: "Colchones Posada - Fábrica de colchones en Armenia, Quindío",
            },
          ],
        }
      : {},
  };
}

export default async function ProductoPage({ params }: Props) {
  const producto = await getProductoPublico(params.slug);

  if (!producto) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <FichaProducto producto={producto} />
    </div>
  );
}
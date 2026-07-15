import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { Producto, ProductoMedida } from "@/types";
import { formatPrecio } from "@/lib/productos";

interface ProductoCardProps {
  producto: Producto;
}

function MedidaPill({ medida }: { medida: ProductoMedida }) {
  return (
    <span className="rounded-full border border-verde/30 bg-verde-muy-claro/50 px-2.5 py-0.5 text-xs text-verde">
      {medida.medida}
    </span>
  );
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes.find(
    (i) => i.tipo === "frontal"
  );
  const precioMasBajo = producto.medidas.reduce(
    (min, m) => (m.precio_normal < min ? m.precio_normal : min),
    Infinity
  );

  const badgeMap: Record<string, { text: string; variant: "verde" | "acento" | "rojo" }> = {
    "mas-vendido": { text: "Más vendido", variant: "verde" },
    premium: { text: "Premium", variant: "acento" },
    oferta: { text: "Oferta", variant: "rojo" },
  };

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-crema-oscura">
        {imagenPrincipal ? (
          <Image
            src={imagenPrincipal.url}
            alt={imagenPrincipal.alt || producto.nombre}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-texto-suave">
            Sin imagen
          </div>
        )}
        {producto.badge && badgeMap[producto.badge] && (
          <div className="absolute left-3 top-3">
            <Badge variant={badgeMap[producto.badge].variant}>
              {badgeMap[producto.badge].text}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold text-texto">
          {producto.nombre}
        </h3>
        <p className="line-clamp-2 text-sm text-texto-suave">
          {producto.descripcion}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {producto.medidas.slice(0, 4).map((m) => (
            <MedidaPill key={m.id} medida={m} />
          ))}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-xl font-bold text-verde">
            Desde {formatPrecio(precioMasBajo)}
          </span>
        </div>

        <span className="mt-1 text-sm font-semibold text-verde transition-colors group-hover:text-verde-oscuro">
          Ver detalles →
        </span>
      </div>
    </Link>
  );
}

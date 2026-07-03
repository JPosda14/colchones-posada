import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-crema">
      <nav className="border-b border-crema-oscura bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-heading text-lg font-bold text-verde">
            Panel Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/productos" className="text-sm text-texto-suave hover:text-verde">
              Productos
            </Link>
            <Link href="/admin/cotizaciones" className="text-sm text-texto-suave hover:text-verde">
              Cotizaciones
            </Link>
            <Link
              href="/"
              className="text-sm text-texto-suave hover:text-verde"
            >
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}

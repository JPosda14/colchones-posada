import { productos } from "@/lib/productos";

export default function AdminProductosPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-texto">
          Productos
        </h1>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-crema-oscura">
            <tr>
              <th className="px-4 py-3 font-medium text-texto-suave">Nombre</th>
              <th className="px-4 py-3 font-medium text-texto-suave">
                Categoría
              </th>
              <th className="px-4 py-3 font-medium text-texto-suave">Slug</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Activo</th>
              <th className="px-4 py-3 font-medium text-texto-suave">Orden</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-crema-oscura/50">
                <td className="px-4 py-3 font-medium text-texto">{p.nombre}</td>
                <td className="px-4 py-3 text-texto-suave">{p.categoria}</td>
                <td className="px-4 py-3 text-texto-suave">{p.slug}</td>
                <td className="px-4 py-3">
                  {p.activo ? (
                    <span className="rounded-full bg-verde-muy-claro px-2 py-0.5 text-xs text-verde">
                      Sí
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-texto-suave">{p.orden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

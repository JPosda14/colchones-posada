import { listCotizaciones } from "@/lib/admin/cotizaciones";
import { CotizacionesList } from "@/components/admin/CotizacionesList";

export default async function AdminCotizacionesPage() {
  let cotizaciones: Awaited<ReturnType<typeof listCotizaciones>> = [];
  let errorCarga = "";

  try {
    cotizaciones = await listCotizaciones();
  } catch {
    errorCarga =
      "No se pudieron cargar las cotizaciones. Verifica que la tabla 'cotizaciones' exista (aplica la migración 004).";
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-texto">
        Cotizaciones
      </h1>
      <p className="mt-2 text-texto-suave">
        Solicitudes enviadas desde el formulario de la web.
      </p>

      {errorCarga && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          {errorCarga}
        </div>
      )}

      <CotizacionesList cotizaciones={cotizaciones} />
    </div>
  );
}
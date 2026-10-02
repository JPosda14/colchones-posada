export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-texto">Dashboard</h1>
      <p className="mt-2 text-texto-suave">
        Resumen de actividad del negocio.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Cotizaciones nuevas", value: "—" },
          { label: "Productos activos", value: "—" },
          { label: "Ventas este mes", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-texto-suave">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-verde">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

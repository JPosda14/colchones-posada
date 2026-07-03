interface BarraFirmezaProps {
  valor: number; // 1-5
}

export function BarraFirmeza({ valor }: BarraFirmezaProps) {
  const porcentaje = (valor / 5) * 100;

  const etiquetas: Record<number, string> = {
    1: "Muy suave",
    2: "Suave",
    3: "Media",
    4: "Firme",
    5: "Muy firme",
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-texto-suave">Firmeza</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-texto-suave">Suave</span>
        <div className="h-2 flex-1 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-verde transition-all"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <span className="text-xs text-texto-suave">Firme</span>
      </div>
      <p className="mt-1 text-right text-sm font-medium text-verde">
        {etiquetas[valor] || "Media"}
      </p>
    </div>
  );
}

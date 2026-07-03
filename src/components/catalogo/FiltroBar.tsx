"use client";

interface FiltroBarProps {
  activo: string;
  onChange: (categoria: string) => void;
}

const CATEGORIAS = [
  { value: "todos", label: "Todos" },
  { value: "colchon", label: "Colchones" },
  { value: "base", label: "Bases" },
  { value: "almohada", label: "Almohadas" },
  { value: "protector", label: "Protectores" },
];

export function FiltroBar({ activo, onChange }: FiltroBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activo === cat.value
              ? "bg-verde text-white"
              : "bg-white text-texto-suave hover:bg-verde-muy-claro"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
